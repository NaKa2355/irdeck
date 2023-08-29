import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RemoteListPage } from "../composes/pages/remotesListPage";
import { ButtonsListPage } from "../composes/pages/buttonsListPage";
import DrawerTemplate from "../composes/templates/drawerTemplate";

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
