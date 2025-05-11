import React, { useState, useRef } from "react";
import { Text, Button, Flex, Tabs } from "@mantine/core";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
import { useSelector } from "react-redux";

// Import your section components
import InventoryDashboard from "./inventoryDashboard";
import HostelInventory from "./HostelInventory";
import Reports from "./Reports";
import Department from "./Bdes";
import InventoryRequests from "./InventoryRequests";
import ReturnedItemsPage from "./ReturnedItemsPage";

const sectionComponents = {
  "Overall Inventory": InventoryDashboard,
  Section: HostelInventory,
  Reports,
  Department,
  Requests: InventoryRequests,
  "Returned Items": ReturnedItemsPage,
};

export default function SectionNavigation() {
  const [activeSection, setActiveSection] = useState("Overall Inventory");
  const [activeTab, setActiveTab] = useState("0");
  const tabsListRef = useRef(null);
  const role = useSelector((state) => state.user.role);

  const sections =
    role === "ps_admin"
      ? [
          "Overall Inventory",
          "Section",
          "Department",
          "Requests",
          "Reports",
          "Returned Items",
        ]
      : role === "deptadmin_ece" || role === "Junior Technician"
        ? ["Department", "Returned Items"]
        : role === "deptadmin_cse"
          ? ["Department", "Returned Items"]
          : role === "deptadmin_me"
            ? ["Department", "Returned Items"]
            : role === "deptadmin_sm"
              ? ["Department", "Returned Items"]
              : role === "deptadmin_design"
                ? ["Department", "Returned Items"]
                : role === "Hostel_admin" || role === "hall1caretaker"
                  ? ["Section", "Returned Items"]
                  : role === "hall3caretaker"
                    ? ["Section", "Returned Items"]
                    : role === "hall4caretaker"
                      ? ["Section", "Returned Items"]
                      : role === "phcaretaker"
                        ? ["Section", "Returned Items"]
                        : role === "nhcaretaker"
                          ? ["Section", "Returned Items"]
                          : role === "mshcaretaker"
                            ? ["Section", "Returned Items"]
                            : role === "rspc_admin"
                              ? ["Section", "Returned Items"]
                              : role === "SectionHead_IWD"
                                ? ["Section", "Returned Items"]
                                : role === "acadadmin"
                                  ? ["Section", "Returned Items"]
                                  : role === "VhCaretaker"
                                    ? ["Section", "Returned Items"]
                                    : ["Returned Items"]; // Default fallback for any other roles

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

  // For all roles except ps_admin, directly load their first page
  if (role !== "ps_admin") {
    return (
      <div style={{ marginTop: "2rem" }}>
        <Flex justify="space-between" align="center" mt="lg">
          <Flex
            justify="flex-start"
            align="center"
            gap="1rem"
            mt="1rem"
            ml="lg"
          >
            <Button
              onClick={() => handleArrowClick("prev")}
              variant="default"
              style={{ border: "none", padding: 0 }}
              disabled={sections.length <= 1}
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
              disabled={sections.length <= 1}
            >
              <CaretCircleRight size={20} />
            </Button>
          </Flex>
        </Flex>

        <div style={{ marginTop: "2rem" }}>
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    );
  }

  // If ps_admin, show the full tab navigation
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
