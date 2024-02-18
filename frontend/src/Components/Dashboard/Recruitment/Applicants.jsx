import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import DashboardOverview from "../DashboardOverview";
import { pdfjs, Document, Page } from "react-pdf";

function Applicants() {
  const { organizationId, jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfMetadata, setPdfMetadata] = useState(null);
  const [pdfTextContent, setPdfTextContent] = useState("");

  useEffect(() => {
    const getApplicants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/GetApplicants/?organizationId=${organizationId}&jobId=${jobId}`
        );
        setApplicants(response.data);
      } catch (error) {
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

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);
  return (
    <div className="flex gap-4">
      <div>
        <Sidebar></Sidebar>
      </div>
      <div className="w-full p-4">
        <DashboardOverview pageName="Applicants"></DashboardOverview>
        <h1 className="my-4 font-bold text-2xl pl-12">
          {applicants.length} Job Application
        </h1>
        <button className="p-2 ml-12 mb-4 text-sm mr-2 bg-sec-color text-white rounded-lg active:text-sec-color active:bg-white">
          Filter
        </button>{" "}
        <div className="flex flex-col flex-wrap justify-between p-3 w-11/12 m-auto bg-sec-color rounded-lg text-white">
          {applicants.map((applicant) => (
            <div key={applicant.id} className=" mb-4 w-full text-sec-color">
              <div className="flex justify-between bg-white p-3 rounded-lg shadow-md">
                <div>
                  <p className="text-sm font-bold">{applicant.name}</p>
                  <p className="text-sm">{applicant.email}</p>
                  <p className="text-sm">{applicant.phoneNumber}</p>
                </div>
                <div className="flex justify-end mt-2">
                  <button className="p-2 text-sm mr-2 bg-sec-color text-white rounded-lg active:text-sec-color active:bg-white">
                    View CV
                  </button>
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
      </div>
    </div>
  );
}

export default Applicants;
