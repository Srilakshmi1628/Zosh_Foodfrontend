import { Create } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import CreateIngredientCategoryForm from "./CreateIngredientCategory";
import { useEffect, useState } from "react";
import CreateIngredientForm from "./CreateIngredientForm";
import { useDispatch, useSelector } from "react-redux";
import {
  getIngredientCategory,
  getIngredientsOfRestaurant,
  updateStockOfIngredient,
} from "../../State/Admin/Ingredients/Action";
import { getRestaurantById } from "../../State/Customers/Restaurant/restaurant.action";

// ✅ ADD THIS
import { useParams } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  outline: "none",
  p: 4,
};

const Ingredients = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // ✅ IMPORTANT

  const { restaurant, ingredients } = useSelector((store) => store);

  const jwt = localStorage.getItem("jwt");

  // ✅ THIS IS THE MAIN FIX
  useEffect(() => {
    if (jwt) {
      dispatch(getIngredientCategory(jwt));
      dispatch(getIngredientsOfRestaurant(jwt));
      dispatch(getRestaurantById(id, jwt));
    }
  }, [dispatch, jwt, id]);

  const [openIngredientCategory, setOpenIngredientCategory] = useState(false);
  const handleOpenIngredientCategory = () => setOpenIngredientCategory(true);
  const handleCloseIngredientCategory = () => setOpenIngredientCategory(false);

  const [openIngredient, setOpenIngredient] = useState(false);
  const handleOpenIngredient = () => setOpenIngredient(true);
  const handleCloseIngredient = () => setOpenIngredient(false);

  const handleUpdateStocke = (id) => {
    dispatch(updateStockOfIngredient({ id, jwt }));
  };

  return (
    <div className="px-2">
      <Grid container spacing={1}>

        {/* INGREDIENTS */}
        <Grid item xs={12} lg={8}>
          <Card className="mt-1">
            <CardHeader
              title={"Ingredients"}
              action={
                <IconButton onClick={handleOpenIngredient}>
                  <Create />
                </IconButton>
              }
            />

            <TableContainer className="h-[88vh] overflow-y-scroll">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Availability</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {ingredients?.ingredients?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category?.name}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleUpdateStocke(item.id)}
                          color={item.inStoke ? "success" : "primary"}
                        >
                          {item.inStoke ? "in stock" : "out of stock"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* CATEGORY */}
        <Grid item xs={12} lg={4}>
          <Card className="mt-1">
            <CardHeader
              title={"Category"}
              action={
                <IconButton onClick={handleOpenIngredientCategory}>
                  <Create />
                </IconButton>
              }
            />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Name</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {ingredients?.category?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </TableContainer>
          </Card>
        </Grid>

      </Grid>

      {/* MODALS */}
      <Modal open={openIngredient} onClose={handleCloseIngredient}>
        <Box sx={style}>
          <CreateIngredientForm handleClose={handleCloseIngredient} />
        </Box>
      </Modal>

      <Modal
        open={openIngredientCategory}
        onClose={handleCloseIngredientCategory}
      >
        <Box sx={style}>
          <CreateIngredientCategoryForm
            handleClose={handleCloseIngredientCategory}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default Ingredients;