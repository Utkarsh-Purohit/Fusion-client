import React, { useState, useRef, useMemo, useEffect } from "react";
import { Text, Button, Flex, Tabs } from "@mantine/core";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
import { useSelector } from "react-redux";

// Import your section components
import InventoryDashboard from "./inventoryDashboard";
import HostelInventory from "./HostelInventory";
import Reports from "./Reports";
import Department from "./Bdes";
import InventoryRequests from "./InventoryRequests";

// Mapping between section names and their corresponding components
const sectionComponents = {
  "Overall Inventory": InventoryDashboard,
  Section: HostelInventory,
  Reports,
  Department,
  Requests: InventoryRequests,
};

export default function SectionNavigation() {
  const role = useSelector((state) => state.user.role);
  const tabsListRef = useRef(null);

  // Dynamically determine available sections based on role
  const sections = useMemo(() => {
    if (role === "ps_admin") {
      return [
        "Overall Inventory",
        "Section",
        "Department",
        "Requests",
        "Reports",
      ];
    }
    if (
      [
        "deptadmin_ece",
        "deptadmin_cse",
        "deptadmin_me",
        "deptadmin_sm",
        "deptadmin_design",
        "Junior Technician",
      ].includes(role)
    ) {
      return ["Department"];
    }
    if (
      [
        "Hostel_admin",
        "hall1caretaker",
        "hall3caretaker",
        "hall4caretaker",
        "phcaretaker",
        "nhcaretaker",
        "mshcaretaker",
        "rspc_admin",
        "SectionHead_IWD",
        "acadadmin",
        "VhCaretaker",
      ].includes(role)
    ) {
      return ["Section"];
    }
    return [];
  }, [role]);

  const [activeTab, setActiveTab] = useState("0");
  const [activeSection, setActiveSection] = useState(sections[0] || "");

  // Ensure when sections change (role changes), activeSection resets
  useEffect(() => {
    setActiveSection(sections[0] || "");
    setActiveTab("0");
  }, [sections]);

  const tabItems = sections.map((section) => ({ title: section }));

  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
    setActiveSection(sections[+tabIndex]);
  };

  const handleArrowClick = (direction) => {
    const newIndex =
      direction === "next"
        ? Math.min(+activeTab + 1, tabItems.length - 1)
        : Math.max(+activeTab - 1, 0);
    setActiveTab(String(newIndex));
    setActiveSection(sections[newIndex]);

    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({
        left: direction === "next" ? 50 : -50,
        behavior: "smooth",
      });
    }
  };

  const navi = (sec, id) => {
    setActiveTab(String(id));
    setActiveSection(sec);
  };

  const ActiveComponent = sectionComponents[activeSection];

  if (role === "unauthorized") {
    return (
      <Flex justify="center" align="center" style={{ height: "100vh" }}>
        <Text color="red" size="lg">
          Unauthorized Access
        </Text>
      </Flex>
    );
  }

  if (sections.length === 0) {
    return (
      <Flex justify="center" align="center" style={{ height: "100vh" }}>
        <Text color="red" size="lg">
          You do not have permission to access this page.
        </Text>
      </Flex>
    );
  }

  return (
    <>
      <Flex justify="space-between" align="center" mt="lg">
        <Flex justify="flex-start" align="center" gap="1rem" mt="1rem" ml="lg">
          <Button
            onClick={() => handleArrowClick("prev")}
            variant="default"
            style={{ border: "none", padding: 0 }}
          >
            <CaretCircleLeft size={20} />
          </Button>

          <div
            ref={tabsListRef}
            style={{
              overflowX: "auto",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            <Tabs value={activeTab} onTabChange={handleTabChange}>
              <Tabs.List>
                {tabItems.map((item, index) => (
                  <Tabs.Tab
                    key={index}
                    value={`${index}`}
                    onClick={() => navi(item.title, index)}
                    style={{
                      color: activeTab === `${index}` ? "#4299E1" : "",
                      backgroundColor:
                        activeTab === `${index}` ? "#15abff13" : "",
                    }}
                  >
                    <Text>{item.title}</Text>
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs>
          </div>

          <Button
            onClick={() => handleArrowClick("next")}
            variant="default"
            style={{ border: "none", padding: 0 }}
          >
            <CaretCircleRight size={20} />
          </Button>
        </Flex>
      </Flex>

      <div style={{ marginTop: "2rem" }}>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </>
  );
}
