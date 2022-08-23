const { Product } = require("./productModel");
const express = require("express");
//const cartDefaultImg = require("../../assets/product-default-image.png");
const auth = require("../../middlewares/middleware");
const router = express.Router();
const chalk = require("chalk");
const { validateProduct } = require("./productValidation");

/* A route for present all the products */
router.get(
  "/allproducts",
  /* auth, */ async (req, res) => {
    try {
      const products = await Product.find();
      return res.send(products);
    } catch (error) {
      console.log(chalk.redBright(error.message));
      res.status(500).send(error.message);
    }
  }
);
/* A route for present all the products by specific category */
router.get("/allproducts/:category", auth, async (req, res) => {
  const category = req.params.category;
  const productFilter = {
    category: category,
  };
  try {
    const products = await Product.find(productFilter);
    return res.send(products);
  } catch (error) {
    console.log(chalk.redBright(error.message));
    res.status(500).send(error.message);
  }
});

/* A route for present all the products of specific user */
router.get("/myproducts", auth, async (req, res) => {
  const userId = req.user._id;
  const productFilter = {
    userID: userId,
  };
  Product.find(productFilter)
    .then((product) => {
      res.json(product);
      console.log("products of:", req.user.name);
    })
    .catch((product) => res.status(400).json(product));
});
/* A route for create a new product */
router.post("/createnewproduct", auth, async (req, res) => {
  try {
    const user = req.user;

    let product = req.body;
    const { error } = validateProduct(product);

    if (error) {
      console.log(chalk.redBright(error.details[0].message));
      return res.status(400).send(error.details[0].message);
    }

    let imageBaseUrl = "https://cdn.pixabay.com/photo/";

    if (product.image === "") {
      product.image =
        product.category === "Phones"
          ? imageBaseUrl + "2018/05/21/13/12/phone-3418270_960_720.png"
          : product.category === "Computers"
          ? imageBaseUrl + "2017/03/08/14/20/flat-2126880_960_720.png"
          : product.category === "Accessories"
          ? imageBaseUrl + "2022/01/07/20/40/icon-6922627_960_720.png"
          : imageBaseUrl + "2013/07/12/14/53/cart-148964_960_720.png";
    }
    product.userID = user._id;

    product = new Product(product);
    await product.save();

    return res.send(product);
  } catch (error) {
    console.log(chalk.redBright(error.message));
    res.status(500).send(error.message);
  }
});

/* A route for update single product */
router.put("/:productid", auth, async (req, res) => {
  const updatedProduct = req.body;
  const userId = req.user._id;
  const productId = req.params.productid;

  const productFilter = {
    _id: productId,
    userID: userId,
  };

  Product.updateOne(productFilter, updatedProduct)
    .then((product) => res.json(product))
    .catch((product) => res.status(400).json(product));
});

/* A route for delete a single product */
router.delete("/:productid", auth, async (req, res) => {
  const productId = req.params.productid;
  const userid = req.user._id;
  const deletedProductFilter = {
    _id: productId,
    userID: userid,
  };

  Product.deleteOne(deletedProductFilter)
    .then((product) => res.json(product))
    .catch((product) => res.status(500).json(product));
});

/* A route for present all products from the wish list of specific user */
router.get("/wishlist", auth, async (req, res) => {
  const userId = req.user._id;

  Product.find({
    likes: {
      $in: [userId],
    },
  }).then((newProduct) => {
    res.json(newProduct);
  });
});
/* A route for add an user id to the likes array of specific product */
router.post("/addtowishlist/:productid", auth, (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productid;
  let newLikesArr = [];

  Product.findById(productId)
    .then((product) => {
      const originalLikesArr = product.likes;
      console.log("Likes arr:", originalLikesArr);

      if (originalLikesArr.includes(userId)) {
        console.log("Already liked!");
        // throw Error();
      } else {
        newLikesArr = [...originalLikesArr];
        newLikesArr.push(userId);
      }
    })
    .then(() => {
      const productFilter = {
        _id: productId,
      };
      const updateFilter = {
        likes: newLikesArr,
      };

      Product.updateOne(productFilter, updateFilter)
        .then((product) => res.json(product))
        .catch((product) => res.status(400).json(product));
    })
    .catch((product) => res.status(500).json(product));
});
/* A route for remove an user id from the likes array of specific product */
router.post("/removefromwishlist/:productid", auth, (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productid;
  let newLikesArr = [];

  Product.findById(productId)
    .then((product) => {
      const originalLikesArr = product.likes;
      console.log("Likes arr:", originalLikesArr);

      if (originalLikesArr.includes(userId)) {
        newLikesArr = [...originalLikesArr];

        const removeIdIndex = newLikesArr.indexOf(userId);
        newLikesArr.splice(removeIdIndex, 1);
      } else {
        throw Error();
      }
    })
    .then(() => {
      const productFilter = {
        _id: productId,
      };
      const updateFilter = {
        likes: newLikesArr,
      };
      Product.updateOne(productFilter, updateFilter)
        .then((product) => res.json(product))
        .catch((product) => res.status(400).json(product));
    })
    .catch((product) => res.status(500).json(product));
});

module.exports = router;
