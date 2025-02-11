import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Paper,
  Button,
  Text,
  Select,
  Modal,
} from "@mantine/core";
import AddProduct from "./AddProduct";
import TransferProduct from "./TransferProduct";

export default function HostelInventory() {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showTransferProductModal, setShowTransferProductModal] =
    useState(false);

  const departments = [
    { label: "H1", value: "H1" },
    { label: "H3", value: "H3" },
    { label: "H4", value: "H4" },
    { label: "Panini", value: "Panini" },
    { label: "Nagarjuna", value: "Nagarjuna" },
    { label: "Maa Saraswati", value: "Maa Saraswati" },
    { label: "RSPC", value: "RSPC" },
    { label: "GymKhana", value: "GymKhana" },
    { label: "IWD", value: "IWD" },
    { label: "Mess", value: "Mess" },
    { label: "Academic", value: "Academic" },
    { label: "VH", value: "VH" },
  ];

  const fetchDepartmentData = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("Please log in to view inventory");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/inventory/api/sections/?section=${selectedDepartment}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch department data");
      }

      const data = await response.json();
      setInventoryData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching department data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentData();
  }, [selectedDepartment]);

  return (
    <>
      <Container
        style={{
          marginTop: "20px",
          maxWidth: "1400px",
          maxHeight: "1000px",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        <Text
          align="center"
          style={{
            fontSize: "25px",
            marginBottom: "15px",
            fontWeight: 650,
            color: "#228BE6",
          }}
        >
          Hostel Inventory
        </Text>

        <Select
          placeholder="Select Department"
          data={departments}
          value={selectedDepartment}
          onChange={setSelectedDepartment}
          style={{ marginBottom: "15px", width: "40%", margin: "auto" }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
            gap: "10px",
          }}
        >
          <Button
            variant="filled"
            color="blue"
            onClick={() => setShowTransferProductModal(true)}
          >
            Transfer Item
          </Button>
          <Button
            variant="filled"
            color="blue"
            onClick={() => setShowAddProductModal(true)}
          >
            Add Product
          </Button>
        </div>

        <Paper
          shadow={false}
          p="lg"
          style={{ borderRadius: "12px", backgroundColor: "transparent" }}
        >
          <div style={{ overflowX: "auto" }}>
            <Table striped highlightOnHover verticalSpacing="md">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={2} style={{ textAlign: "center" }}>
                      Loading data...
                    </td>
                  </tr>
                ) : (
                  inventoryData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.item_name}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Paper>
      </Container>

      <Modal
        opened={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        title="Add Product"
      >
        <AddProduct
          closeModal={() => setShowAddProductModal(false)}
          selectedDepartment={selectedDepartment}
        />
      </Modal>

      <Modal
        opened={showTransferProductModal}
        onClose={() => setShowTransferProductModal(false)}
        title="Transfer Product"
      >
        <TransferProduct
          closeModal={() => setShowTransferProductModal(false)}
          selectedDepartment={selectedDepartment}
        />
      </Modal>
    </>
  );
}
