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
} from "@mantine/core";
import { useSelector } from "react-redux";
import AddProduct from "./AddProduct";
import TransferProduct from "./TransferProduct";
import RequestProduct from "./RequestProduct";
import { InventoryDepartments } from "../../../routes/inventoryRoutes";

export default function Inventory() {
  const role = useSelector((state) => state.user.role);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showTransferProductModal, setShowTransferProductModal] =
    useState(false);
  const [showRequestProductModal, setShowRequestProductModal] = useState(false);

  const departments = [
    { label: "CSE", value: "CSE" },
    { label: "ECE", value: "ECE" },
    { label: "ME", value: "ME" },
    { label: "SM", value: "SM" },
    { label: "NS", value: "NS" },
    { label: "Design", value: "Design" },
  ];

  // Returns the appropriate department label and customizes the department list based on role.
  const renderDepartmentLabel = () => {
    switch (role) {
      case "deptadmin_cse":
        return "CSE";
      case "deptadmin_ece":
      case "Junior Technician":
        return "ECE";
      case "deptadmin_me":
        return "ME";
      case "deptadmin_sm":
        return "SM";
      case "deptadmin_design":
        return "Design";
      default:
        return selectedDepartment || "CSE";
    }
  };

  // Auto-set the department if not already selected.
  useEffect(() => {
    if (!selectedDepartment) {
      setSelectedDepartment(renderDepartmentLabel());
    }
  }, [role, selectedDepartment]);

  const fetchDepartmentData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in to view inventory");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        InventoryDepartments(`${selectedDepartment}`),
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
    if (selectedDepartment) {
      fetchDepartmentData();
    }
  }, [selectedDepartment]);

  // Modal open/close functions
  const openAddProductModal = () => setShowAddProductModal(true);
  const closeAddProductModal = () => setShowAddProductModal(false);
  const openTransferProductModal = () => setShowTransferProductModal(true);
  const closeTransferProductModal = () => setShowTransferProductModal(false);
  const openRequestProductModal = () => setShowRequestProductModal(true);
  const closeRequestProductModal = () => setShowRequestProductModal(false);

  const isDefaultRole = ![
    "deptadmin_cse",
    "deptadmin_ece",
    "Junior Technician",
    "deptadmin_me",
    "deptadmin_sm",
    "deptadmin_design",
  ].includes(role);

  return (
    <>
      {/* Breadcrumb */}
      <Text style={{ marginLeft: "70px", fontSize: "16px" }} color="dimmed">
        <span
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedDepartment("")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setSelectedDepartment("");
          }}
        >
          Departments
        </span>
        {" > "} <span>{renderDepartmentLabel()}</span>
      </Text>

      <Text
        align="center"
        style={{
          fontSize: "26px",
          marginBottom: "20px",
          fontWeight: 600,
          color: "#228BE6",
        }}
      >
        {renderDepartmentLabel()} Department Inventory
      </Text>

      {/* Dropdown for department selection (visible for default roles) */}
      {isDefaultRole && (
        <Select
          placeholder="Select Department"
          data={departments}
          value={selectedDepartment}
          onChange={setSelectedDepartment}
          style={{
            marginBottom: "20px",
            width: "70%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      )}

      {/* Action Buttons */}
      <Group
        position="center"
        style={{
          marginBottom: "20px",
          gap: "10px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {isDefaultRole && (
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
        {!isDefaultRole && (
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

      {/* Inventory Table */}
      <ScrollArea style={{ width: "90%", margin: "20px auto" }}>
        <Table
          striped
          highlightOnHover
          verticalSpacing="md"
          horizontalSpacing="lg"
          fontSize="sm"
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e0e0e0",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <th
                style={{
                  padding: "16px",
                  border: "1px solid #e0e0e0",
                  fontWeight: 600,
                }}
              >
                Item
              </th>
              <th
                style={{
                  padding: "16px",
                  border: "1px solid #e0e0e0",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Quantity
              </th>
              <th
                style={{
                  padding: "16px",
                  border: "1px solid #e0e0e0",
                  fontWeight: 600,
                  textAlign: "right",
                }}
              >
                Price
              </th>
              <th
                style={{
                  padding: "16px",
                  border: "1px solid #e0e0e0",
                  fontWeight: 600,
                }}
              >
                Purchase Date
              </th>
              <th
                style={{
                  padding: "16px",
                  border: "1px solid #e0e0e0",
                  fontWeight: 600,
                }}
              >
                Indent ID
              </th>
              <th
                style={{
                  padding: "16px",
                  border: "1px solid #e0e0e0",
                  fontWeight: 600,
                }}
              >
                Specifications
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Text size="md" color="dimmed">
                    Loading inventory data...
                  </Text>
                </td>
              </tr>
            ) : inventoryData.length > 0 ? (
              inventoryData.map((item, index) => (
                <tr key={index}>
                  <td
                    style={{
                      padding: "16px",
                      border: "1px solid #e0e0e0",
                      fontWeight: 500,
                    }}
                  >
                    {item.item_name}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      border: "1px solid #e0e0e0",
                      textAlign: "center",
                    }}
                  >
                    <Badge
                      color={item.quantity < 5 ? "red" : "blue"}
                      variant="light"
                      radius="sm"
                    >
                      {item.quantity}
                    </Badge>
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      border: "1px solid #e0e0e0",
                      textAlign: "right",
                      fontWeight: 500,
                    }}
                  >
                    {item.price ? (
                      <Text>₹{parseFloat(item.price).toFixed(2)}</Text>
                    ) : (
                      <Text color="dimmed">N/A</Text>
                    )}
                  </td>
                  <td style={{ padding: "16px", border: "1px solid #e0e0e0" }}>
                    {item.date_of_purchase ? (
                      <Text>
                        {new Date(item.date_of_purchase).toLocaleDateString()}
                      </Text>
                    ) : (
                      <Text color="dimmed">N/A</Text>
                    )}
                  </td>
                  <td style={{ padding: "16px", border: "1px solid #e0e0e0" }}>
                    {item.indent_id || <Text color="dimmed">N/A</Text>}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      border: "1px solid #e0e0e0",
                      maxWidth: "200px",
                    }}
                  >
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
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Text size="md" color="dimmed">
                    No inventory items found
                  </Text>
                  <Button
                    variant="light"
                    color="blue"
                    size="sm"
                    mt="sm"
                    onClick={openAddProductModal}
                  >
                    Add First Item
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>

      {/* Add Product Modal (visible to all roles) */}
      {showAddProductModal && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            }}
            role="button"
            tabIndex={0}
            onClick={closeAddProductModal}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") closeAddProductModal();
            }}
            aria-label="Close Add Product Modal Background"
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: "600px",
              backgroundColor: "#fff",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              zIndex: 1001,
              overflow: "hidden",
            }}
          >
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "transparent",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={closeAddProductModal}
              aria-label="Close Modal"
            >
              X
            </button>
            <div style={{ margin: "20px" }}>
              <AddProduct
                closeModal={closeAddProductModal}
                selectedDepartment={selectedDepartment}
                val="departments"
                name="department_name"
              />
            </div>
          </div>
        </>
      )}

      {/* Transfer Product Modal (only for default roles) */}
      {isDefaultRole && showTransferProductModal && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            }}
            role="button"
            tabIndex={0}
            onClick={closeTransferProductModal}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                closeTransferProductModal();
            }}
            aria-label="Close Transfer Product Modal Background"
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: "600px",
              backgroundColor: "#fff",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              zIndex: 1001,
              overflow: "hidden",
            }}
          >
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "transparent",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={closeTransferProductModal}
              aria-label="Close Modal"
            >
              X
            </button>
            <div style={{ margin: "20px" }}>
              <TransferProduct
                closeModal={closeTransferProductModal}
                selectedDepartment={selectedDepartment}
              />
            </div>
          </div>
        </>
      )}

      {/* Request Product Modal (for non-default roles) */}
      {!isDefaultRole && showRequestProductModal && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            }}
            role="button"
            tabIndex={0}
            onClick={closeRequestProductModal}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                closeRequestProductModal();
            }}
            aria-label="Close Request Product Modal Background"
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: "600px",
              backgroundColor: "#fff",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              zIndex: 1001,
              overflow: "hidden",
            }}
          >
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "transparent",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={closeRequestProductModal}
              aria-label="Close Modal"
            >
              X
            </button>
            <div style={{ margin: "20px" }}>
              <RequestProduct
                closeModal={closeRequestProductModal}
                selectedDepartment={selectedDepartment}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
