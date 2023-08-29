import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RemoteListPage } from "../view/pages/remotesListPage";
import { ButtonsListPage } from "../view/pages/buttonsListPage";

export function RootRouter() { 
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={(<RemoteListPage />)} />
                <Route path="/remote" element={(<ButtonsListPage />)} />
            </Routes>
        </BrowserRouter>
    )
}
