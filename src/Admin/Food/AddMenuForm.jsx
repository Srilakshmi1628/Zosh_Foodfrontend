import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  OutlinedInput,
  Snackbar,
} from "@mui/material";

import { uploadToCloudinary } from "../utils/UploadToCloudnary";
import { createMenuItem } from "../../State/Customers/Menu/menu.action";

// ✅ CORRECT IMPORTS
import {
  getIngredientCategory,
  getIngredientsOfRestaurant,
} from "../../State/Admin/Ingredients/Action";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const initialValues = {
  name: "",
  description: "",
  price: "",
  category: "",
  images: [],
  restaurantId: "",
  vegetarian: true,
  seasonal: false,
  quantity: 0,
  ingredients: [],
};

const AddMenuForm = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { restaurant, ingredients, auth, menu } = useSelector(
    (store) => store
  );

  const jwt = localStorage.getItem("jwt");

  const [uploadImage, setUploadingImage] = useState(false);

  // ✅ FETCH DATA (FINAL FIX)
  useEffect(() => {
    if (jwt) {
      dispatch(getIngredientCategory(jwt)); // categories
      dispatch(getIngredientsOfRestaurant(jwt)); // ingredients
    }
  }, [dispatch, jwt]);

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      values.restaurantId = restaurant?.usersRestaurant?.id;

      dispatch(createMenuItem({ menu: values, jwt: auth?.jwt || jwt }));
    },
  });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setUploadingImage(true);
    const image = await uploadToCloudinary(file);

    formik.setFieldValue("images", [
      ...formik.values.images,
      image,
    ]);

    setUploadingImage(false);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  const [openSnackBar, setOpenSnackBar] = useState(false);

  useEffect(() => {
    if (menu?.message || menu?.error) setOpenSnackBar(true);
  }, [menu?.message, menu?.error]);

  return (
    <>
      <div className="lg:px-32 px-5 lg:flex justify-center min-h-screen items-center pb-5">
        <div>
          <h1 className="font-bold text-2xl text-center py-2">
            Add New Menu Item
          </h1>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <Grid container spacing={2}>

              {/* IMAGE */}
              <Grid item xs={12}>
                <input
                  type="file"
                  accept="image/*"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />

                <label htmlFor="fileInput">
                  <span className="w-24 h-24 cursor-pointer flex items-center justify-center border rounded-md border-gray-600">
                    <AddPhotoAlternateIcon />
                  </span>
                </label>

                {uploadImage && <CircularProgress />}

                <div className="flex gap-2">
                  {formik.values.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        className="w-24 h-24 object-cover"
                        src={image}
                        alt=""
                      />
                      <IconButton
                        onClick={() => handleRemoveImage(index)}
                        size="small"
                        sx={{ position: "absolute", top: 0, right: 0 }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </div>
                  ))}
                </div>
              </Grid>

              {/* NAME */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </Grid>

              {/* DESCRIPTION */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
              </Grid>

              {/* PRICE */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.price}
                />
              </Grid>

              {/* ✅ CATEGORY (FIXED) */}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Food Category</InputLabel>
                  <Select
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                  >
                    {ingredients?.category?.length > 0 ? (
                      ingredients.category.map((item) => (
                        <MenuItem key={item.id} value={item}>
                          {item.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No Categories Found</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>

              {/* INGREDIENTS */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Ingredients</InputLabel>
                  <Select
                    multiple
                    name="ingredients"
                    value={formik.values.ingredients}
                    onChange={formik.handleChange}
                    input={<OutlinedInput label="Ingredients" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value.id} label={value.name} />
                        ))}
                      </Box>
                    )}
                  >
                    {ingredients?.ingredients?.length > 0 ? (
                      ingredients.ingredients.map((item) => (
                        <MenuItem key={item.id} value={item}>
                          {item.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No Ingredients Found</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>

            </Grid>

            <Button type="submit" variant="contained">
              Create Menu Item
            </Button>
          </form>
        </div>
      </div>

      <Snackbar open={openSnackBar} autoHideDuration={3000}>
        <Alert severity={menu?.error ? "error" : "success"}>
          {menu?.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddMenuForm;