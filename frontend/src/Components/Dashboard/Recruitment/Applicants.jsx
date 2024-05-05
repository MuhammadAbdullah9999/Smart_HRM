import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import DashboardOverview from "../DashboardOverview";
import InputField from "../../Styles/InputField";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useParams } from "react-router-dom";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import IconButton from "@mui/material/IconButton";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { pdfjs, Document, Page } from "react-pdf";

function Applicants() {
  const { organizationId, jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfMetadata, setPdfMetadata] = useState(null);
  const [pdfTextContent, setPdfTextContent] = useState("");
  const [filterKeywords, setFilterKeywords] = useState("");
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

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

  const handleEmail = () => {
    window.open(`mailto:${selectedApplicant.email}?subject=${emailSubject}&body=${emailBody}`);
  };

  const handleCall = () => {
    // Implement call functionality here
    // You may use a library like Twilio to make calls
  };

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
          <div className="h-96 flex flex-col pt-6 justify-between p-3 w-11/12 m-auto bg-sec-color rounded-lg text-white overflow-y-auto">
            {applicants.map((applicant) => (
              <div key={applicant._id} className=" mb-4 w-full text-sec-color">
                <div className="flex justify-between bg-white p-3 rounded-lg shadow-md">
                  <div>
                    <p className="text-sm font-bold">{applicant.name}</p>
                    <p className="text-sm">{applicant.email}</p>
                    <p className="text-sm">{applicant.phoneNumber}</p>
                  </div>
                  <div className="flex justify-end mt-2">
                    <div className="px-12">
                    <IconButton onClick={() => setSelectedApplicant(applicant)}>
                      <EmailIcon style={{ color: 'indianRed',fontSize: 30 }} />
                    </IconButton>
                    </div>
                    {/* <IconButton onClick={() => handleCall(applicant)}>
                      <PhoneIcon />
                    </IconButton> */}
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

      {/* Email Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Compose Email</h3>
                    <div className="mt-6">
                      <InputField
                        label="Subject"
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        top='6'
                      />
                      <textarea
                        className="form-textarea mt-2 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                        rows="4"
                        placeholder="Enter email body"
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className= "px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleEmail}
                  className="mx-2 bg-sec-color text-white px-4 border rounded-lg shadow-md hover:text-gray-200 hover:bg-gray-600 active:text-sec-color active:bg-white"
                >
                  Send
                </button>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applicants;
