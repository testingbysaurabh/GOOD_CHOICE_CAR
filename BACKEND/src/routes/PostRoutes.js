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
        const allPosts = await Post.find({ Post });
        res.status(200).json({ data: allPosts });
    } catch (error) {
        res.status(400).json({ error: error.message });
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
        });

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




// router.get('/posts/filter', async (req, res) => {
//     try {
//         const { minPrice, maxPrice, minYear, maxYear, fuelType, transmission, color } = req.query;

//         const filter = {};
//         // Price filter (range)
//         if (minPrice || maxPrice) {
//             filter['price.amount'] = {};
//             if (minPrice) filter['price.amount'].$gte = Number(minPrice);
//             if (maxPrice) filter['price.amount'].$lte = Number(maxPrice);
//         }

//         // Manufacturing year filter (range)
//         if (minYear || maxYear) {
//             filter.manufacturingYear = {};
//             if (minYear) filter.manufacturingYear.$gte = Number(minYear);
//             if (maxYear) filter.manufacturingYear.$lte = Number(maxYear);
//         }

//         // Fuel type filter
//         if (fuelType) {
//             filter.fuelType = fuelType;
//         }

//         // Transmission filter
//         if (transmission) {
//             filter.transmission = transmission;
//         }

//         // Color filter
//         if (color) {
//             filter.color = color;
//         }

//         const filteredPosts = await Post.find(filter);

//         if (filteredPosts.length === 0) {
//             return res.status(404).json({ msg: "No matching posts found" });
//         }

//         res.status(200).json({ data: filteredPosts });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//         // http://localhost:8080/api/posts/filter?minPrice=500000&maxPrice=1000000&fuelType=Petrol&transmission=Manual
//     }
// });



// router.get('/posts/filter', async (req, res) => {
//     try {
//       const {
//         q,              // search query 
//         minPrice,
//         maxPrice,
//         minYear,
//         maxYear,
//         fuelType,
//         transmission,
//         color
//       } = req.query;

//       // Build filter object
//       const filter = {};

//       // Search string ke liye regex match (brand, model, variant, color)
//       if (q) {
//         const regex = new RegExp(q, 'i');
//         filter.$or = [
//           { brand: regex },
//           { model: regex },
//           { variant: regex },
//           { color: regex }
//         ];
//       }

//       // Price range filter
//       if (minPrice || maxPrice) {
//         filter['price.amount'] = {};
//         if (minPrice) filter['price.amount'].$gte = Number(minPrice);
//         if (maxPrice) filter['price.amount'].$lte = Number(maxPrice);
//       }

//       // Year range filter
//       if (minYear || maxYear) {
//         filter.manufacturingYear = {};
//         if (minYear) filter.manufacturingYear.$gte = Number(minYear);
//         if (maxYear) filter.manufacturingYear.$lte = Number(maxYear);
//       }

//       // Fuel type filter
//       if (fuelType) {
//         filter.fuelType = fuelType;
//       }

//       // Transmission filter
//       if (transmission) {
//         filter.transmission = transmission;
//       }

//       // Color exact match
//       if (color) {
//         filter.color = color;
//       }

//       const result = await Post.find(filter);

//       if (!result.length) {
//         return res.status(404).json({ msg: 'No matching posts found' });
//       }

//       res.status(200).json({ data: result });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     //   api/posts/filter?q=scorpio&minPrice=500000&maxPrice=1000000&fuelType=Diesel
//     }
//   });









/////admin




// router.post("/admin/posts/create-post", isLoggedIn, async (req, res) => {
//     try {
//         const {
//             brand,
//             model,
//             variant,
//             price: { amount, currency },
//             kilometersDriven,
//             manufacturingYear,
//             registrationYear,
//             owners,
//             fuelType,
//             transmission,
//             color,
//             seller: {
//                 sellerName,
//                 contact,
//                 location: { city, area },
//             },
//             insurance,
//             images,
//         } = req.body;

//         // Now use these variables to create your Post document
//         const NewPost = await Post.create({
//             brand,
//             model,
//             variant,
//             price: { amount, currency },
//             kilometersDriven,
//             manufacturingYear,
//             registrationYear,
//             owners,
//             fuelType,
//             transmission,
//             color,
//             seller: {
//                 sellerName,
//                 contact,
//                 location: { city, area },
//             },
//             insurance,
//             images,
//             author: req.user._id,
//         });


//         ///for push  post id in user arry 
//         req.user.posts.push(NewPost._id)
//         await req.user.save()


//         res.status(201).json({ msg: "Post created", data: NewPost });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });



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
            manufacturingYear: manufacturingYear
                ? Number(manufacturingYear)
                : undefined,
            registrationYear: registrationYear
                ? Number(registrationYear)
                : undefined,
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
            author: req.user._id,      // from isLoggedIn middleware
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

        // Delete the post document
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
