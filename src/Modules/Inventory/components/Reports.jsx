import React, { useState, useEffect } from "react";
import {
  Table,
  Checkbox,
  Container,
  Text,
  Select,
  Grid,
  Paper,
  Loader,
  useMantineTheme,
} from "@mantine/core";
import axios from "axios";

export default function Reports() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("CSE");
  const [checkedItems, setCheckedItems] = useState({});
  const theme = useMantineTheme();

  const departments = [
    { label: "CSE", value: "CSE" },
    { label: "ECE", value: "ECE" },
    { label: "Mech", value: "Mech" },
    { label: "SM", value: "SM" },
    { label: "Design", value: "Design" },
    { label: "NS", value: "NS" },
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
    { label: "Computer centre", value: "Computer centre" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.example.com/reports");
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter(
    (item) => item.department === selectedDepartment,
  );

  const handleCheckboxChange = (product) => {
    setCheckedItems((prev) => ({
      ...prev,
      [product]: !prev[product],
    }));
  };

  return (
    <Container>
      <Text style={{ marginLeft: "70px", fontSize: "16px" }}>
        <span
          style={{ cursor: "pointer", textDecoration: "underline" }}
          role="button"
          tabIndex={0}
          onClick={() => setSelectedDepartment("")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setSelectedDepartment("");
            }
          }}
        >
          Reports
        </span>
        {" > "} <span>{selectedDepartment}</span>
      </Text>

      <Text
        align="center"
        style={{
          fontSize: "26px",
          marginBottom: "20px",
          fontWeight: 650,
          color: theme.colors.blue[6],
        }}
      >
        {selectedDepartment} Reports
      </Text>

      <Grid gutter="md" justify="center" style={{ marginBottom: "20px" }}>
        <Grid.Col span={12} md={6}>
          <Select
            label="Select Department"
            placeholder="Choose a department"
            value={selectedDepartment}
            onChange={(value) => setSelectedDepartment(value || "")}
            data={departments}
            clearable
          />
        </Grid.Col>
      </Grid>

      {loading ? (
        <Loader
          size="xl"
          style={{ display: "flex", justifyContent: "center" }}
        />
      ) : (
        <Paper
          shadow="xs"
          p="lg"
          style={{
            borderRadius: "12px",
            overflowX: "auto",
            marginLeft: "81px",
            maxWidth: "100%",
          }}
        >
          <Table striped highlightOnHover verticalSpacing="md">
            <thead>
              <tr>
                <th style={{ fontSize: "16px", textAlign: "center" }}>
                  Select
                </th>
                <th style={{ fontSize: "16px", textAlign: "center" }}>
                  Products
                </th>
                <th style={{ fontSize: "16px", textAlign: "center" }}>
                  Quantity
                </th>
                <th style={{ fontSize: "16px", textAlign: "center" }}>
                  Missing
                </th>
                <th style={{ fontSize: "16px", textAlign: "center" }}>
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "center" }}>
                    <Checkbox
                      checked={!!checkedItems[item.product]}
                      onChange={() => handleCheckboxChange(item.product)}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>{item.product}</td>
                  <td style={{ textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ textAlign: "center" }}>{item.missing}</td>
                  <td style={{ textAlign: "center" }}>{item.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Paper>
      )}
    </Container>
  );
}
