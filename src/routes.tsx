import { createBrowserRouter } from "react-router";
import { Auth } from "./views/Auth";
import { DashboardLayout } from "./views/DashboardLayout";
import { DashboardMenu } from "./views/DashboardMenu";
import { CrearTablaView } from "./views/CrearTablaView";
import { EditarTablasView } from "./views/EditarTablasView";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Auth,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: DashboardMenu,
      },
      {
        path: "create",
        Component: CrearTablaView,
      },
      {
        path: "edit/:dbId",
        Component: EditarTablasView,
      },
    ],
  },
]);
