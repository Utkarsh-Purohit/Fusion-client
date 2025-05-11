import React, { useState, useEffect } from "react";
import {
  Table,
  Text,
  ScrollArea,
  Badge,
  LoadingOverlay,
  Group,
  Paper,
  TextInput,
  Select,
  Box,
  Pagination,
} from "@mantine/core";
import { InventoryReturn } from "../../../routes/inventoryRoutes";

const departments = [
  "CSE",
  "ECE",
  "Mech",
  "SM",
  "Design",
  "NS",
  "H1",
  "H3",
  "H4",
  "Panini",
  "Nagarjuna",
  "Maa Saraswati",
  "RSPC",
  "GymKhana",
  "IWD",
  "Mess",
  "Academic",
  "VH",
];

function ReturnedItemsPage() {
  const [returnedItems, setReturnedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchReturnedItems = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(InventoryReturn, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch returned items");

      const data = await response.json();
      setReturnedItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnedItems();
  }, []);

  const filteredItems = returnedItems.filter((item) => {
    const matchesSearch = item.item_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesDepartment =
      !selectedDepartment ||
      (item.department_name || item.section_name || "").includes(
        selectedDepartment,
      );

    return matchesSearch && matchesDepartment;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <Box p="md" style={{ maxWidth: "1200px", margin: "auto" }}>
      <Group position="center" mb="xl">
        <Text size="xl" weight={700} color="blue">
          Returned Items
        </Text>
      </Group>

      <Group position="apart" mb="xl" grow>
        <TextInput
          placeholder="Search by item name"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />

        <Select
          data={[
            { value: "", label: "All Departments" },
            ...departments.map((dept) => ({ value: dept, label: dept })),
          ]}
          value={selectedDepartment}
          onChange={(val) => {
            setSelectedDepartment(val);
            setCurrentPage(1);
          }}
          placeholder="Filter by department"
          clearable
        />
      </Group>

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
                  Item Name
                </th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                  Quantity
                </th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                  From Department
                </th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                  Return Date
                </th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                  Specifications
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item, index) => (
                  <tr
                    key={item.return_id || item.id}
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
                        color="blue"
                        variant="light"
                        style={{ minWidth: "60px" }}
                      >
                        {item.quantity_returned}
                      </Badge>
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {item.department_name || item.section_name || "N/A"}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      {item.return_date
                        ? new Date(item.return_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "N/A"}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                      <Text lineClamp={1} style={{ maxWidth: "200px" }}>
                        {item.specifications || "—"}
                      </Text>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    <Text color="dimmed">
                      {loading ? "Loading..." : "No returned items found"}
                    </Text>
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

      {error && (
        <Text color="red" mt="md" size="sm">
          Error: {error}
        </Text>
      )}
    </Box>
  );
}

export default ReturnedItemsPage;
