import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RemoteListPage } from "../components/pages/remotesListPage";
import { ButtonsListPage } from "../components/pages/buttonsListPage";
import DrawerTemplate from "../components/templates/drawerTemplate";

export function RootRouter() { 
    return(
        <DrawerTemplate/>
        // <BrowserRouter>
        //     <Routes>
        //         <Route path="/" element={(<RemoteListPage />)} />
        //         <Route path="/remote" element={(<ButtonsListPage />)} />
        //     </Routes>
        // </BrowserRouter>
    )
}
