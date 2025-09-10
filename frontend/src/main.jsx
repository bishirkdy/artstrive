import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { store } from "./redux/store.js";
import Home from "./pages/Home.jsx";
import Login from "./components/Login.jsx";
import Committee from "./pages/committee/Committee.jsx";
import EditTeams from "./pages/committee/teams/EditTeams.jsx";
import AddTeams from "./pages/committee/teams/AddTeams.jsx";
import EditProfile from "./pages/committee/profile/EditProfile.jsx";
import AddZone from "./pages/committee/zone/AddZone.jsx";
import AddStudent from "./pages/student/AddStudent.jsx";
import ViewStudent from "./pages/student/ViewStudent.jsx";
import EditStudent from "./pages/student/EditStudent.jsx";
import CreateProgram from "./pages/committee/program/CreateProgram.jsx";
import ProgramList from "./pages/program/ProgramList.jsx";
import EditProgram from "./pages/program/EditProgram.jsx";
import AddProgram from "./pages/program/AddProgram.jsx";
import StudentsProgramList from "./pages/program/StudentsProgramList.jsx";
import StudentWise from "./pages/program/StudentWise.jsx";
import AddCodeLetter from "./pages/committee/codeLetter/AddCodeLetter.jsx";
import AddScore from "./pages/committee/score/AddScore.jsx";
import ViewCodeLetter from "./pages/committee/codeLetter/ViewCodeLetter.jsx";
import ViewMarks from "./pages/committee/score/ViewMarks.jsx";
import DeclareResult from "./pages/committee/result/DeclareResult.jsx";
import DeclaredResults from "./pages/committee/result/DeclaredResults.jsx";
import SpecifiedResults from "./pages/Results/SpecifiedResults.jsx";
import AllResults from "./pages/Results/AllResults.jsx";
import ViewSelected from "./pages/Results/ViewSelected.jsx";
import TeamScore from "./pages/achivements/TeamScore.jsx";
import StudentScoreByZone from "./pages/achivements/StudentScoreByZone.jsx";
import StudentScore from "./pages/achivements/StudentScore.jsx";
import EvaluationSheet from "./pages/committee/forms/EvaluationList.jsx";
import CallList from "./pages/committee/forms/CallList.jsx";
import IdCard from "./pages/IdCard.jsx";
import OneStudent from "./pages/student/OneStudent.jsx";
import ScannedStudentHome from "./pages/scannedStudent/ScannedStudentHome.jsx";
import ProfileScanned from "./pages/scannedStudent/pages/ProfileScanned.jsx";
import ProgramScanned from "./pages/scannedStudent/pages/ProgramScanned.jsx";
import ResultScanned from "./pages/scannedStudent/pages/ResultScanned.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import ScannedHome from "./pages/scannedStudent/pages/ScannedHome.jsx";
import { ToastContainer } from "react-toastify";

import ErrorBoundary from "./components/Error.jsx";
import RouteErrorBoundary from "./components/RouteErrorBoundary.jsx"; 
import Test from "./components/Test.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} errorElement={<RouteErrorBoundary />} />
      <Route path="/test" element={<Test/>} />
      <Route path="/" element={<App />} errorElement={<RouteErrorBoundary />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Home />} />
        <Route path="addstudent" element={<AddStudent />} />
        <Route path="viewstudent" element={<ViewStudent />} />
        <Route path="idcard" element={<IdCard />} />
        <Route path="editstudent/:_id" element={<EditStudent />} />
        <Route path="programlist" element={<ProgramList />} />
        <Route path="addprograms" element={<AddProgram />} />
        <Route path="viewprogram" element={<StudentsProgramList />} />
        <Route path="viewprogramsstudentwise" element={<StudentWise />} />
        <Route path="specifiedresults" element={<SpecifiedResults />} />
        <Route path="allresults" element={<AllResults />} />
        <Route path="viewprogramdetails/:_id" element={<ViewSelected />} />
        <Route path="teamscore" element={<TeamScore />} />
        <Route path="scorebyzone" element={<StudentScoreByZone />} />
        <Route path="studentscore" element={<StudentScore />} />
        <Route path="student/:_id" element={<OneStudent />} />

        <Route path="committee" element={<Committee />} errorElement={<RouteErrorBoundary />}>
          <Route path="addteams" element={<AddTeams />} />
          <Route path="editteams/:id" element={<EditTeams />} />
          <Route path="profile/:id" element={<EditProfile />} />
          <Route path="addzone" element={<AddZone />} />
          <Route path="createprogram" element={<CreateProgram />} />
          <Route path="editprogram/:_id" element={<EditProgram />} />
          <Route path="calllist" element={<CallList />} />
          <Route path="evaluation" element={<EvaluationSheet />} />
          <Route path="addcodeletter" element={<AddCodeLetter />} />
          <Route path="addscore" element={<AddScore />} />
          <Route path="viewcodeletter" element={<ViewCodeLetter />} />
          <Route path="viewscore" element={<ViewMarks />} />
          <Route path="declareresults" element={<DeclareResult />} />
          <Route path="declaredresults" element={<DeclaredResults />} />
        </Route>
      </Route>

      <Route path="s/:slug" element={<ScannedStudentHome />} errorElement={<RouteErrorBoundary />}>
        <Route index element={<ScannedHome />} />
        <Route path="dashboard" element={<DashBoard />} />
        <Route path="profile" element={<ProfileScanned />} />
        <Route path="program" element={<ProgramScanned />} />
        <Route path="result" element={<ResultScanned />} />
      </Route>

      <Route path="*" element={<h1>Page not found</h1>} />
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ErrorBoundary> 
      <ToastContainer />
      <RouterProvider router={router} />
    </ErrorBoundary>
  </Provider>
);
