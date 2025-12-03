const express = require("express");
const { Post } = require("../models/Posts");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const { isAuthor } = require("../middleware/isAuthor");
const { User } = require("../models/User");
const router = express.Router();

const upload = require("../middleware/upload");
const cloudinary = require("../Config/cloudinary");
const fs = require("fs").promises;




//public
router.get("/all-posts", async (req, res) => {
    try {
        const allPosts = await Post.find({});
        res.status(200).json({ data: allPosts });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Search suggestions for autocomplete
router.get('/posts/search/suggestions', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.status(200).json({ data: [] });
        }

        const regex = new RegExp(q, 'i');
        const limit = parseInt(req.query.limit) || 5;

        const suggestions = await Post.find({
            $or: [
                { brand: regex },
                { model: regex },
                { variant: regex },
                { color: regex }
            ]
        })
            .select('brand model variant color price images')
            .limit(limit)
            .sort({ createdAt: -1 });

        // Format suggestions for dropdown
        const formattedSuggestions = suggestions.map(post => ({
            _id: post._id,
            title: `${post.brand} ${post.model}${post.variant ? ` ${post.variant}` : ''}`,
            brand: post.brand,
            model: post.model,
            variant: post.variant,
            color: post.color,
            price: post.price,
            image: post.images?.[0] || null
        }));

        res.status(200).json({ data: formattedSuggestions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get('/posts/search', async (req, res) => {
    try {
        const { q } = req.query; // Search query string

        if (!q) {
            return res.status(400).json({ error: 'Search query parameter "q" is required' });
        }

        // Case-insensitive regex search on multiple fields
        const regex = new RegExp(q, 'i');

        const matchedPosts = await Post.find({
            $or: [
                { brand: regex },
                { model: regex },
                { variant: regex },
                { color: regex }
            ]
        })
            .sort({ createdAt: -1 });

        if (matchedPosts.length === 0) {
            return res.status(404).json({ msg: 'No products found matching the query' });
        }

        res.status(200).json({ data: matchedPosts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get("/posts/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const foundPost = await Post.findById(id);
        if (!foundPost) throw new Error("Post does not exist");

        res.status(200).json({ msg: "Post found", data: foundPost });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



router.get("/feed", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = {};

        // Search query filter
        if (req.query.q) {
            const regex = new RegExp(req.query.q, 'i');
            filter.$or = [
                { brand: regex },
                { model: regex },
                { variant: regex },
                { color: regex }
            ];
        }

        // Price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            filter['price.amount'] = {};
            if (req.query.minPrice) filter['price.amount'].$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filter['price.amount'].$lte = Number(req.query.maxPrice);
        }

        // Year range filter (using registrationYear)
        if (req.query.minYear || req.query.maxYear) {
            filter.registrationYear = {};
            if (req.query.minYear) filter.registrationYear.$gte = Number(req.query.minYear);
            if (req.query.maxYear) filter.registrationYear.$lte = Number(req.query.maxYear);
        }

        // Fuel type filter
        if (req.query.fuelType) {
            filter.fuelType = req.query.fuelType;
        }

        // Transmission filter
        if (req.query.transmission) {
            filter.transmission = req.query.transmission;
        }

        // Color filter
        if (req.query.color) {
            filter.color = new RegExp(req.query.color, 'i');
        }

        // Build aggregation pipeline
        // If we have both $or (search) and other filters, combine them with $and
        let matchFilter = filter;
        if (filter.$or && Object.keys(filter).length > 1) {
            const { $or, ...otherFilters } = filter;
            matchFilter = {
                $and: [
                    { $or },
                    otherFilters
                ]
            };
        }

        const pipeline = [
            // Match filter first
            ...(Object.keys(matchFilter).length > 0 ? [{ $match: matchFilter }] : []),

            // Sort by newest first
            { $sort: { createdAt: -1 } },

            // Lookup author information from User collection
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "authorInfo"
                }
            },

            // Unwind authorInfo array
            {
                $unwind: {
                    path: "$authorInfo",
                    preserveNullAndEmptyArrays: true
                }
            },

            // Project only necessary fields
            {
                $project: {
                    brand: 1,
                    model: 1,
                    variant: 1,
                    price: 1,
                    kilometersDriven: 1,
                    manufacturingYear: 1,
                    registrationYear: 1,
                    owners: 1,
                    fuelType: 1,
                    transmission: 1,
                    color: 1,
                    seller: 1,
                    insurance: 1,
                    images: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    author: {
                        _id: "$authorInfo._id",
                        firstName: "$authorInfo.firstName",
                        lastName: "$authorInfo.lastName",
                        mail: "$authorInfo.mail"
                    }
                }
            },

            // Skip and limit for pagination
            { $skip: skip },
            { $limit: limit }
        ];

        // Get total count with filters
        const countPipeline = [
            ...(Object.keys(matchFilter).length > 0 ? [{ $match: matchFilter }] : []),
            { $count: "total" }
        ];
        const countResult = await Post.aggregate(countPipeline);
        const totalPosts = countResult.length > 0 ? countResult[0].total : 0;

        const feedPosts = await Post.aggregate(pipeline);

        res.status(200).json({
            success: true,
            data: feedPosts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalPosts / limit),
                totalPosts: totalPosts,
                hasNextPage: skip + limit < totalPosts,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});






router.get('/posts/filter', async (req, res) => {
    try {
        const {
            q,              // search query 
            minPrice,
            maxPrice,
            minYear,
            maxYear,
            fuelType,
            transmission,
            color
        } = req.query;

        // Build filter object
        const filter = {};

        // Search string ke liye regex match (brand, model, variant, color)
        if (q) {
            const regex = new RegExp(q, 'i');
            filter.$or = [
                { brand: regex },
                { model: regex },
                { variant: regex },
                { color: regex }
            ];
        }

        // Price range filter
        if (minPrice || maxPrice) {
            filter['price.amount'] = {};
            if (minPrice) filter['price.amount'].$gte = Number(minPrice);
            if (maxPrice) filter['price.amount'].$lte = Number(maxPrice);
        }

        // Year range filter
        if (minYear || maxYear) {
            filter.manufacturingYear = {};
            if (minYear) filter.manufacturingYear.$gte = Number(minYear);
            if (maxYear) filter.manufacturingYear.$lte = Number(maxYear);
        }

        // Fuel type filter
        if (fuelType) {
            filter.fuelType = fuelType;
        }

        // Transmission filter
        if (transmission) {
            filter.transmission = transmission;
        }

        // Color exact match
        if (color) {
            filter.color = color;
        }

        const result = await Post.find(filter);

        if (!result.length) {
            return res.status(404).json({ msg: 'No matching posts found' });
        }

        res.status(200).json({ data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
        //   api/posts/filter?q=scorpio&minPrice=500000&maxPrice=1000000&fuelType=Diesel
    }
});









router.post("/admin/posts/create-post", isLoggedIn, upload.array("images", 10), async (req, res) => {
    try {

        let imageUrls = [];  //// IMAGES: Cloudinary pe upload karke URLs array banayenge

        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "car-posts",
                });

                // local file delete
                await fs.unlink(file.path);

                return result.secure_url; // sirf URL chahiye, kyunki schema => [String]
            });

            imageUrls = await Promise.all(uploadPromises);
        }



        const {
            brand,
            model,
            variant,
            amount,
            currency,
            kilometersDriven,
            manufacturingYear,
            registrationYear,
            owners,
            fuelType,
            transmission,
            color,
            sellerName,
            contact,
            city,
            area,
            insurance,
            pincode,
        } = req.body;

        // Boolean ka proper conversion
        const insuranceBool = typeof insurance === "string" ? insurance === "true" || insurance === "1" || insurance === "yes" : !!insurance;

        // Post  schema ko follow karke
        const NewPost = await Post.create({
            brand: brand,
            model: model,
            variant: variant,
            price: {
                amount: Number(amount),
                currency: currency || "INR",
            },
            kilometersDriven: kilometersDriven ? Number(kilometersDriven) : undefined,
            manufacturingYear: manufacturingYear ? Number(manufacturingYear) : undefined,
            registrationYear: registrationYear ? Number(registrationYear) : undefined,
            owners: owners,
            fuelType: fuelType,
            transmission: transmission,
            color: color,
            seller: {
                sellerName: sellerName,
                contact: contact,
                location: {
                    city: city,
                    area: area,
                    pincode: pincode,
                },
            },
            insurance: insuranceBool,
            images: imageUrls,         // yaha saari Cloudinary URLs ka array
            author: req.user._id      // from isLoggedIn middleware
        });

        //  User ke posts array me push karo
        if (req.user && req.user.posts) {
            req.user.posts.push(NewPost._id);
            await req.user.save();
        }

        return res.status(201).json({ msg: "Post created", data: NewPost });
    } catch (error) {
        // console.error(error);
        return res.status(400).json({ error: error.message });
    }
}
);





router.delete("/admin/posts/delete/:id", isLoggedIn, isAuthor, async (req, res) => {
    try {
        const { id } = req.params;

        // First, find the post to get the images
        const postToDelete = await Post.findById(id);
        if (!postToDelete) {
            return res.status(404).json({ msg: "Post not found" });
        }

        // Delete images from Cloudinary if they exist
        if (postToDelete.images && postToDelete.images.length > 0) {
            const deletePromises = postToDelete.images.map(async (imageUrl) => {
                try {

                    // Extract the path after /upload/
                    const uploadIndex = imageUrl.indexOf('/upload/');
                    if (uploadIndex === -1) return;

                    let pathAfterUpload = imageUrl.substring(uploadIndex + '/upload/'.length);

                    // Remove version if present (v1234567890/)
                    if (pathAfterUpload.startsWith('v')) {
                        const versionEnd = pathAfterUpload.indexOf('/');
                        if (versionEnd !== -1) {
                            pathAfterUpload = pathAfterUpload.substring(versionEnd + 1);
                        }
                    }

                    // Remove file extension to get public_id
                    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');

                    // Delete from Cloudinary
                    await cloudinary.uploader.destroy(publicId);
                } catch (error) {
                    // Log error but don't fail the entire operation
                    console.error(`Error deleting image from Cloudinary: ${error.message}`);
                }
            });

            // Wait for all image deletions to complete
            await Promise.all(deletePromises);
        }

        // Delete the post document from database
        await Post.deleteOne({ _id: id });

        // Remove the post ID from the User's posts array
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { posts: id }
        });

        res.status(200).json({ msg: "Post deleted successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});



router.patch('/admin/posts/edit/:id', isLoggedIn, isAuthor, async (req, res) => {
    try {
        const { id } = req.params;

        const {
            brand,
            model,
            variant,
            price,
            kilometersDriven,
            manufacturingYear,
            registrationYear,
            owners,
            fuelType,
            transmission,
            color,
            seller,
            insurance,
            images,
            pincode,
        } = req.body;


        const updateData = {};
        if (brand) updateData.brand = brand;
        if (model) updateData.model = model;
        if (variant) updateData.variant = variant;
        if (price) updateData.price = price;
        if (kilometersDriven !== undefined) updateData.kilometersDriven = kilometersDriven;
        if (manufacturingYear) updateData.manufacturingYear = manufacturingYear;
        if (registrationYear) updateData.registrationYear = registrationYear;
        if (owners) updateData.owners = owners;
        if (fuelType) updateData.fuelType = fuelType;
        if (transmission) updateData.transmission = transmission;
        if (color) updateData.color = color;
        if (seller) updateData.seller = seller;
        if (insurance !== undefined) updateData.insurance = insurance;
        if (images) updateData.images = images;

        // Find the post and update
        const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedPost) throw new Error('Post not found');

        res.status(200).json({ msg: 'Post updated successfully', data: updatedPost });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});






module.exports = {
    PostRoutes: router,
};
