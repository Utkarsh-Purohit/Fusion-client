import React, { useState } from "react";
import PropTypes from "prop-types";
import { InventoryAdd } from "../../../routes/inventoryRoutes";

const styles = {
  container: {
    padding: "20px",
    maxWidth: "500px",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "5px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "100%",
  },
  textarea: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "100%",
    minHeight: "80px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
};

function AddProduct({ onSuccess, selectedDepartment, val, name }) {
  const [formData, setFormData] = useState({
    productName: "",
    quantity: "",
    price: "",
    dateOfPurchase: "",
    indentId: "",
    specifications: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name: fieldName, value } = e.target;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    // Clear error when user starts typing
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.productName.trim()) {
      errors.productName = "Product name is required";
      isValid = false;
    }

    if (!formData.quantity) {
      errors.quantity = "Quantity is required";
      isValid = false;
    } else if (Number.isNaN(Number(formData.quantity))) {
      // Added missing parenthesis here
      errors.quantity = "Quantity must be a number";
      isValid = false;
    } else if (parseInt(formData.quantity, 10) < 0) {
      errors.quantity = "Quantity cannot be negative";
      isValid = false;
    }

    if (formData.price && Number.isNaN(Number(formData.price))) {
      errors.price = "Price must be a number";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setErrorMessage("Please log in to add a product");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        item_name: formData.productName,
        quantity: parseInt(formData.quantity, 10),
        [name]: selectedDepartment,
        ...(formData.price && { price: parseFloat(formData.price) }),
        ...(formData.dateOfPurchase && {
          date_of_purchase: formData.dateOfPurchase,
        }),
        ...(formData.indentId && { indent_id: formData.indentId }),
        ...(formData.specifications && {
          specifications: formData.specifications,
        }),
      };

      const response = await fetch(InventoryAdd(`${val}`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Handle field-specific errors from server
        if (errorData.errors) {
          setFieldErrors(errorData.errors);
        } else {
          throw new Error(errorData.detail || "Failed to add product");
        }
        return;
      }

      const data = await response.json();
      console.log("Product added:", data);
      alert("Product added successfully!");
      if (onSuccess) onSuccess();

      // Reset form
      setFormData({
        productName: "",
        quantity: "",
        price: "",
        dateOfPurchase: "",
        indentId: "",
        specifications: "",
      });
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(
        error.message || "An error occurred while adding the product",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add New Product</h2>

      {errorMessage && <p style={styles.error}>{errorMessage}</p>}

      <form style={styles.form} onSubmit={handleSubmit}>
        <div>
          <label style={styles.label}>Product Name *</label>
          <input
            type="text"
            name="productName"
            placeholder="Enter product name"
            value={formData.productName}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(fieldErrors.productName && { borderColor: "red" }),
            }}
          />
          {fieldErrors.productName && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "-10px",
                marginBottom: "10px",
              }}
            >
              {fieldErrors.productName}
            </p>
          )}
        </div>

        <div>
          <label style={styles.label}>Quantity *</label>
          <input
            type="number"
            name="quantity"
            min="0"
            placeholder="Enter quantity"
            value={formData.quantity}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(fieldErrors.quantity && { borderColor: "red" }),
            }}
          />
          {fieldErrors.quantity && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "-10px",
                marginBottom: "10px",
              }}
            >
              {fieldErrors.quantity}
            </p>
          )}
        </div>

        <div>
          <label style={styles.label}>Price</label>
          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            placeholder="Enter price"
            value={formData.price}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(fieldErrors.price && { borderColor: "red" }),
            }}
          />
          {fieldErrors.price && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "-10px",
                marginBottom: "10px",
              }}
            >
              {fieldErrors.price}
            </p>
          )}
        </div>

        <div>
          <label style={styles.label}>Purchase Date</label>
          <input
            type="date"
            name="dateOfPurchase"
            value={formData.dateOfPurchase}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div>
          <label style={styles.label}>Indent ID</label>
          <input
            type="text"
            name="indentId"
            placeholder="Enter indent ID"
            value={formData.indentId}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div>
          <label style={styles.label}>Specifications</label>
          <textarea
            name="specifications"
            placeholder="Enter specifications"
            value={formData.specifications}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(loading && { backgroundColor: "#6c757d" }),
          }}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

AddProduct.propTypes = {
  onSuccess: PropTypes.func,
  selectedDepartment: PropTypes.string.isRequired,
  val: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default AddProduct;
