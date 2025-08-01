import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Admission from "./pages/TablePages/Admission";
import Enquiry from "./pages/TablePages/Enquiry";
import Contact from "./pages/TablePages/Contact";
import SingleAdmission from "./pages/SinglePages/SingleAdmission";
import SingleEnquiry from "./pages/SinglePages/SingleEnquiry";
import SingleContact from "./pages/SinglePages/SingleContact";
import Gallery from "./pages/Gallery/Gallery";
import Banner from "./pages/Banners/Banner";

import { Toaster } from "sonner";
import NewGallery from "./pages/NewData/NewGallery/NewGallery";
import Member from "./pages/Member/Member";
import Staff from "./pages/Member/Staff";
import NewStaff from "./pages/NewData/NewMember/NewStaff";
import NewFounding from "./pages/NewData/NewMember/NewFounding";
import UpdateFounding from "./pages/UpdateData/UpdateMember/UpdateFounding";
import UpdateStaff from "./pages/UpdateData/UpdateMember/UpdateStaff";
import Student from "./pages/TablePages/Student";
import SingleStudent from "./pages/SinglePages/SingleStudent";
import UpdateStudent from "./pages/UpdateData/UpdateStudent/UpdateStudent";
import GalleryFolder from "./pages/GalleryFolder/GalleryFolder";
import NewGalleryFolder from "./pages/NewData/NewGalleryFolder/NewGalleryFolder";
import UpdateGalleryFolder from "./pages/UpdateData/UpdateGalleryFolder/UpdateGalleryFolder";
import Alumni from "./pages/Alumni/Alumni";
import NewAlumni from "./pages/NewAlumni/NewAlumni";
import UpdateAlumni from "./pages/UpdateData/UpdateAlumni/UpdateAlumni";
import NewStudent from "./pages/NewData/NewStudent/NewStudent";
import Profile from "./pages/Profile/Profile";
import UpdatePassword from "./pages/UpdatePassword/UpdatePassword";
import { useContext } from "react";
import { Context } from "./context/Context";
import Course1 from "./pages/Courses/Course1";
import NewCourse from "./pages/NewCourse/NewCourse";
import SingleCourse from "./pages/SingleCourse/SingleCourse";
import Course2 from "./pages/Courses/Course2";
import Course3 from "./pages/Courses/Course3";
import UpdateCourse from "./pages/UpdateCourse/UpdateCourse";
import AdmissionForm from "./pages/AdmissionForm/AdmissionForm";
import UpdateAdmissionForm from "./pages/UpdateAdmissionForm/UpdateAdmissionForm";
import PaperDesign from "./pages/PaperDesign/PaperDesign";
import NewPaper from "./pages/NewPaper/NewPaper";
import UpdatePaper from "./pages/UpdatePaper/UpdatePaper";
import MarkSheet from "./pages/MarkSheet/MarkSheet";
import MarkSheetTable from "./components/MarksheetTable/MarksheetTable";
import SingleMarksheet from "./pages/SingleMarksheet/SingleMarksheet";
import UpdateMarkSheet from "./pages/UpdateMarkSheet/UpdateMarkSheet";
import MarksheetPreview from "./components/MarksheetPreview/MarksheetPreview";
import Affiliated from "./pages/Affiliated/Affiliated";
import NewAffiliated from "./pages/Affiliated/NewAffiliated";
import AboutContent from "./pages/AboutContent/AboutContent";
import UpdateAbout from "./pages/AboutContent/UpdateAbout";
import HomeContent from "./pages/HomeContent/HomeContent";
import UpdateHomeContent from "./pages/HomeContent/UpdateHomeContent";
import ContactDetails from "./pages/ContactDetails/ContactDetails";

import { toast } from "sonner";

function App() {
  const { user } = useContext(Context);

  const shown = new Set();
  const originalToastError = toast.error;

  toast.error = (message, opts = {}) => {
    const key = typeof message === "string" ? message : JSON.stringify(message);
    if (shown.has(key)) return;
    shown.add(key);
    originalToastError(message, opts);
    setTimeout(() => shown.delete(key), 2000);
  };

  return (
    <div className="app">
      {/* <BrowserRouter basename="/admin"> */}
        <BrowserRouter>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />

            <Route path="/mentor" element={<Member />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/enquiry" element={<Enquiry />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery-folder" element={<GalleryFolder />} />
            <Route path="/certificate" element={<Student />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/update-password" element={<UpdatePassword />} />

            {/* Single Page */}
            <Route path="/admission/:id" element={<SingleAdmission />} />
            <Route path="/enquiry/:id" element={<SingleEnquiry />} />
            <Route path="/contact/:id" element={<SingleContact />} />
            <Route path="/student/:id" element={<SingleStudent />} />
            <Route path="/gallery-folder/:id" element={<Gallery />} />

            {/* banner */}
            <Route path="/banner/:bannerType/:id" element={<Banner />} />

            {/* courses */}
            <Route path="/courses/main-courses" element={<Course1 />} />
            <Route path="/courses/ug-courses" element={<Course2 />} />
            <Route path="/courses/pg-courses" element={<Course3 />} />

            <Route path="/courses/new-course" element={<NewCourse />} />
            <Route path="/course/:id/:course-name" element={<SingleCourse />} />
            <Route
              path="/course/update-course/:id/:course-name"
              element={<UpdateCourse />}
            />

            {/* new */}
            <Route path="/new-gallery" element={<NewGallery />} />
            <Route path="/new-staff-member" element={<NewStaff />} />
            <Route path="/new-mentor" element={<NewFounding />} />
            <Route path="/new-gallery-folder" element={<NewGalleryFolder />} />
            <Route path="/new-alumni" element={<NewAlumni />} />
            <Route path="/new-student" element={<NewStudent />} />
            <Route path="/new-admission" element={<AdmissionForm />} />

            {/* update */}
            <Route path="/mentor/:id" element={<UpdateFounding />} />
            <Route path="/staff-member/:id" element={<UpdateStaff />} />
            <Route path="/update-student/:id" element={<UpdateStudent />} />
            <Route path="/update-alumni/:id" element={<UpdateAlumni />} />
            <Route
              path="/update-admission/:id"
              element={<UpdateAdmissionForm />}
            />

            <Route
              path="/update-gallery-folder/:id"
              element={<UpdateGalleryFolder />}
            />

            {/* Paper Design */}
            <Route path="/paper-design" element={<PaperDesign />} />
            <Route path="/new-paper" element={<NewPaper />} />
            <Route path="/paper/:id" element={<UpdatePaper />} />
            <Route path="/marksheets" element={<MarkSheetTable />} />
            <Route path="/marksheet/:id" element={<SingleMarksheet />} />

            {/* Marksheet */}

            {/* Affiliated */}
            <Route path="/affiliated-colleges" element={<Affiliated />} />
            <Route
              path="/new-affiliated-colleges"
              element={<NewAffiliated />}
            />

            {/* About Content */}

            <Route path="/about-content" element={<AboutContent />} />
            <Route path="/update-about-content" element={<UpdateAbout />} />

            {/* Course image */}
            <Route path="/home-content-image" element={<HomeContent />} />
            <Route
              path="/update-home-content-image/:id"
              element={<UpdateHomeContent />}
            />

            {/* Contact  */}
            <Route path="/contact-details" element={<ContactDetails />} />

            {/* <Route path="*" element={<Navigate to="/" />} /> */}
          </Route>
          <Route path="/new-marksheet" element={<MarkSheet />} />
          <Route path="/update-marksheet/:id" element={<UpdateMarkSheet />} />
          <Route path="/markSheet-preview" element={<MarksheetPreview />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
