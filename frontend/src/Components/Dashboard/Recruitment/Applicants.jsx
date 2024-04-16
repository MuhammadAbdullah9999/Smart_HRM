import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import DashboardOverview from "../DashboardOverview";
import { pdfjs, Document, Page } from "react-pdf";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import InputField from "../../Styles/InputField";
import CircularProgress from "@mui/material/CircularProgress";

function Applicants() {
  const { organizationId, jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfMetadata, setPdfMetadata] = useState(null);
  const [pdfTextContent, setPdfTextContent] = useState("");
  const [filterKeywords, setFilterKeywords] = useState("");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const getApplicants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/GetApplicants/?organizationId=${organizationId}&jobId=${jobId}`
        );

        setLoading(false);
        setApplicants(response.data);
      } catch (error) {
        setApiError(error.response.data);
        setLoading(false);
        console.error("Error fetching applicants:", error);
      }
    };
    getApplicants();
  }, [organizationId, jobId]);

  const openPdfInNewWindow = (blobUrl) => {
    const newWindow = window.open();
    newWindow.document.write(
      `<iframe src="${blobUrl}" width="100%" height="100%"></iframe>`
    );
  };

  const handlePdfClick = async (pdfData) => {
    try {
      if (pdfData) {
        const response = await fetch(`data:application/pdf;base64,${pdfData}`);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setSelectedPdf(blobUrl);

        openPdfInNewWindow(blobUrl);

        const loadingTask = pdfjs.getDocument(blobUrl);
        const pdf = await loadingTask.promise;
        setPdfMetadata(pdf.numPages);

        // Extract text content separately
        const page = await pdf.getPage(1);
        const textContent = await page.getTextContent();
        const text = textContent.items.map((item) => item.str).join(" ");
        setPdfTextContent(text);
      }
    } catch (error) {
      console.error("PDF.js Error:", error);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/GetTopApplicants/?organizationId=${organizationId}&jobId=${jobId}&job_description=${filterKeywords}`
      );
      setLoading(false);
      const filteredApplicants = response.data.ranking;

      // Sort applicants based on ranking
      const sortedApplicants = filteredApplicants.sort(
        (a, b) => a.ranking - b.ranking
      );

      setApplicants(sortedApplicants);
    } catch (error) {
      setLoading(false);
      setApiError(error.response.data);
      console.error("Error filtering applicants:", error);
    }
  };

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

  return (
    <div
      className={`flex gap-4 ${
        loading ? "pointer-events-none opacity-70" : ""
      }`}
    >
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <CircularProgress color="primary" />
        </div>
      )}
      <div>
        <Sidebar></Sidebar>
      </div>
      <div className="w-full p-4">
        <DashboardOverview pageName="Applicants"></DashboardOverview>
        <h1 className="my-4 font-bold text-2xl pl-12">
          {applicants.length} Job Application
        </h1>
        <div className="flex gap-4">
          <div className="ml-12">
            <InputField
              label="Enter Keywords"
              type="text"
              id="search"
              name="search"
              autoComplete="off"
              value={filterKeywords}
              onChange={(e) => setFilterKeywords(e.target.value)}
              focusColor="sec-color"
              top="6"
            />
          </div>
          <button
            className="p-2 px-4  mb-4 text-sm mr-2 bg-sec-color text-white rounded-lg active:text-sec-color active:bg-white"
            onClick={handleFilter}
          >
            <FilterAltIcon className="mr-1"></FilterAltIcon>Filter
          </button>
        </div>
        {!loading && (
          <div className="flex flex-col flex-wrap  pt-6 justify-between p-3 w-11/12 m-auto bg-sec-color rounded-lg text-white">
            {applicants.map((applicant) => (
              <div key={applicant._id} className=" mb-4 w-full text-sec-color">
                <div className="flex justify-between bg-white p-3 rounded-lg shadow-md">
                  <div>
                    <p className="text-sm font-bold">{applicant.name}</p>
                    <p className="text-sm">{applicant.email}</p>
                    <p className="text-sm">{applicant.phoneNumber}</p>
                  </div>
                  <div className="flex justify-end mt-2">
                    {/* <button className="p-2 text-sm mr-2 bg-sec-color text-white rounded-lg active:text-sec-color active:bg-white">
                      View CV
                    </button> */}
                    <button
                      className="p-2 text-sm bg-sec-color text-white rounded-lg active:text-sec-color active:bg-white"
                      onClick={() => handlePdfClick(applicant.cv)}
                    >
                      Download CV
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {apiError && (<p className="text-red-500">{apiError}</p>)}
      </div>
    </div>
  );
}

export default Applicants;
