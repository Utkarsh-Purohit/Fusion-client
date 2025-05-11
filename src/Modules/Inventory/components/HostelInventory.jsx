import React, { useState, useEffect } from "react";
import {
  Table,
  Group,
  Button,
  Text,
  Select,
  ScrollArea,
  Tooltip,
  Badge,
  NumberInput,
  ActionIcon,
  Modal,
  Box,
  LoadingOverlay,
  Paper,
  Pagination,
} from "@mantine/core";
import { useSelector } from "react-redux";
import { notifications } from "@mantine/notifications";
import { IconArrowBack } from "@tabler/icons-react";
import AddProduct from "./AddProduct";
import TransferProduct from "./TransferProduct";
import RequestProduct from "./RequestProduct";
import {
  InventorySections,
  InventoryReturn,
} from "../../../routes/inventoryRoutes";

export default function HostelInventory() {
  const role = useSelector((state) => state.user.role);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showTransferProductModal, setShowTransferProductModal] =
    useState(false);
  const [showRequestProductModal, setShowRequestProductModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedReturnItem, setSelectedReturnItem] = useState(null);
  const [returnQuantity, setReturnQuantity] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Full list of departments
  let departments = [
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

  const renderDepartmentLabel = () => {
    if (role === "ps_admin") {
      return selectedDepartment || "H1";
    }
    switch (role) {
      case "hall1caretaker":
        departments = [{ label: "H1", value: "H1" }];
        return "H1";
      case "hall3caretaker":
        departments = [{ label: "H3", value: "H3" }];
        return "H3";
      case "hall4caretaker":
        departments = [{ label: "H4", value: "H4" }];
        return "H4";
      case "phcaretaker":
        departments = [{ label: "Panini", value: "Panini" }];
        return "Panini";
      case "nhcaretaker":
        departments = [{ label: "Nagarjuna", value: "Nagarjuna" }];
        return "Nagarjuna";
      case "mshcaretaker":
        departments = [{ label: "Maa Saraswati", value: "Maa Saraswati" }];
        return "Maa Saraswati";
      case "rspc_admin":
        departments = [{ label: "RSPC", value: "RSPC" }];
        return "RSPC";
      case "SectionHead_IWD":
        departments = [{ label: "IWD", value: "IWD" }];
        return "IWD";
      case "mess_manager":
        departments = [{ label: "Mess", value: "Mess" }];
        return "Mess";
      case "acadadmin":
        departments = [{ label: "Academic", value: "Academic" }];
        return "Academic";
      case "VhCaretaker":
        departments = [{ label: "VH", value: "VH" }];
        return "VH";
      default:
        return "H1";
    }
  };

  useEffect(() => {
    if (!selectedDepartment) {
      if (role === "ps_admin") {
        setSelectedDepartment("H1");
      } else {
        setSelectedDepartment(renderDepartmentLabel());
      }
    }
  }, [role, selectedDepartment]);

  const fetchDepartmentData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      notifications.show({
        title: "Error",
        message: "Please log in to view inventory",
        color: "red",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(InventorySections(`${selectedDepartment}`), {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch department data");
      }
      const data = await response.json();
      setInventoryData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching department data: ", error);
      notifications.show({
        title: "Error",
        message: "Failed to load inventory data",
        color: "red",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDepartment) {
      fetchDepartmentData();
    }
  }, [selectedDepartment]);

  const handleReturnItem = async () => {
    if (!selectedReturnItem) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      notifications.show({
        title: "Error",
        message: "Please log in to return items",
        color: "red",
      });
      return;
    }

    try {
      const response = await fetch(InventoryReturn, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          item_name: selectedReturnItem.item_name,
          quantity_returned: returnQuantity,
          section_name: selectedDepartment,
          price: selectedReturnItem.price,
          specifications: selectedReturnItem.specifications,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to return item");
      }

      notifications.show({
        title: "Success",
        message: `${returnQuantity} ${selectedReturnItem.item_name}(s) returned successfully`,
        color: "green",
      });
      setShowReturnModal(false);
      fetchDepartmentData();
    } catch (error) {
      notifications.show({
        title: "Return Failed",
        message: error.message,
        color: "red",
      });
    }
  };

  const openReturnModal = (item) => {
    setSelectedReturnItem(item);
    setReturnQuantity(1);
    setShowReturnModal(true);
  };

  const closeReturnModal = () => {
    setShowReturnModal(false);
    setSelectedReturnItem(null);
  };

  const openAddProductModal = () => setShowAddProductModal(true);
  const closeAddProductModal = () => setShowAddProductModal(false);
  const openTransferProductModal = () => setShowTransferProductModal(true);
  const closeTransferProductModal = () => setShowTransferProductModal(false);
  const openRequestProductModal = () => setShowRequestProductModal(true);
  const closeRequestProductModal = () => setShowRequestProductModal(false);

  // Filter out items with zero quantity
  const availableItems = inventoryData.filter((item) => item.quantity > 0);

  // Pagination Logic
  const totalPages = Math.ceil(availableItems.length / itemsPerPage);
  const paginatedItems = availableItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <Box p="md" style={{ maxWidth: "1200px", margin: "auto" }}>
      <Group position="center" mb="xl">
        <Text size="xl" weight={700} color="blue">
          {renderDepartmentLabel()} Inventory
        </Text>
      </Group>

      {/* Dropdown for department selection (always visible) */}
      <Select
        placeholder="Select Department"
        data={departments.map((dept) => ({
          value: dept.value,
          label: dept.label,
        }))}
        value={selectedDepartment}
        onChange={setSelectedDepartment}
        style={{
          marginBottom: "20px",
          width: "100%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />

      {/* Action Buttons */}
      <Group position="apart" mb="xl" grow>
        {role === "ps_admin" && (
          <Button
            variant="filled"
            color="blue"
            onClick={openTransferProductModal}
            size="md"
          >
            Transfer Item
          </Button>
        )}
        <Button
          variant="filled"
          color="blue"
          onClick={openAddProductModal}
          size="md"
        >
          Add Product
        </Button>
        {role !== "ps_admin" && (
          <Button
            variant="filled"
            color="blue"
            size="md"
            onClick={openRequestProductModal}
          >
            Request Product
          </Button>
        )}
      </Group>

      {/* Inventory Table - Only shows items with quantity > 0 */}
      <Paper withBorder style={{ borderRadius: "8px", overflow: "hidden" }}>
        <LoadingOverlay visible={loading} overlayBlur={2} />

        <ScrollArea>
          <Table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  backgroundColor: "#f0f0f0",
                  borderBottom: "2px solid #ddd",
                }}
              >
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                  Item
                </th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                  Quantity
                </th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                  Price
                </th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                  Purchase Date
                </th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                  Indent ID
                </th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                  Specifications
                </th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      <Text weight={500}>{item.item_name}</Text>
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      <Badge
                        color={item.quantity < 5 ? "red" : "blue"}
                        variant="light"
                        style={{ minWidth: "60px" }}
                      >
                        {item.quantity}
                      </Badge>
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {item.price ? (
                        <Text>₹{parseFloat(item.price).toFixed(2)}</Text>
                      ) : (
                        <Text color="dimmed">N/A</Text>
                      )}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {item.date_of_purchase ? (
                        <Text>
                          {new Date(item.date_of_purchase).toLocaleDateString()}
                        </Text>
                      ) : (
                        <Text color="dimmed">N/A</Text>
                      )}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {item.indent_id || <Text color="dimmed">N/A</Text>}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {item.specifications ? (
                        <Tooltip
                          label={item.specifications}
                          withArrow
                          withinPortal
                        >
                          <Text lineClamp={1} style={{ cursor: "help" }}>
                            {item.specifications}
                          </Text>
                        </Tooltip>
                      ) : (
                        <Text color="dimmed">N/A</Text>
                      )}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      <Tooltip label="Return Item">
                        <ActionIcon
                          color="red"
                          variant="outline"
                          onClick={() => openReturnModal(item)}
                        >
                          <IconArrowBack size="1rem" />
                        </ActionIcon>
                      </Tooltip>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    <Text color="dimmed">
                      {loading
                        ? "Loading..."
                        : "No available inventory items found"}
                    </Text>
                    {!loading && (
                      <Button
                        variant="light"
                        color="blue"
                        size="sm"
                        mt="sm"
                        onClick={openAddProductModal}
                      >
                        Add First Item
                      </Button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </ScrollArea>
      </Paper>

      {totalPages > 1 && (
        <Group position="center" mt="md">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
            size="sm"
            withEdges
          />
        </Group>
      )}

      {/* Return Item Modal */}
      <Modal
        opened={showReturnModal}
        onClose={closeReturnModal}
        title="Return Item"
        centered
      >
        {selectedReturnItem && (
          <Box>
            <Text size="sm" mb="md">
              You are returning: <strong>{selectedReturnItem.item_name}</strong>
            </Text>
            <NumberInput
              label="Quantity to Return"
              description={`Max available: ${selectedReturnItem.quantity}`}
              min={1}
              max={selectedReturnItem.quantity}
              value={returnQuantity}
              onChange={(value) => setReturnQuantity(value)}
              mb="md"
            />
            <Group position="right">
              <Button variant="default" onClick={closeReturnModal}>
                Cancel
              </Button>
              <Button color="red" onClick={handleReturnItem}>
                Confirm Return
              </Button>
            </Group>
          </Box>
        )}
      </Modal>

      {/* Add Product Modal */}
      <Modal
        opened={showAddProductModal}
        onClose={closeAddProductModal}
        title="Add New Product"
        size="lg"
      >
        <AddProduct
          closeModal={closeAddProductModal}
          selectedDepartment={selectedDepartment}
          val="sections"
          name="section_name"
          refreshData={fetchDepartmentData}
        />
      </Modal>

      {/* Transfer Product Modal */}
      <Modal
        opened={showTransferProductModal}
        onClose={closeTransferProductModal}
        title="Transfer Item"
        size="lg"
      >
        <TransferProduct
          closeModal={closeTransferProductModal}
          selectedDepartment={selectedDepartment}
          refreshData={fetchDepartmentData}
        />
      </Modal>

      {/* Request Product Modal */}
      <Modal
        opened={showRequestProductModal}
        onClose={closeRequestProductModal}
        title="Request Product"
        size="lg"
      >
        <RequestProduct
          closeModal={closeRequestProductModal}
          selectedDepartment={selectedDepartment}
        />
      </Modal>
    </Box>
  );
}
