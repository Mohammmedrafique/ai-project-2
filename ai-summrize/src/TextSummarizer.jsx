import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AlertTriangle,
  Download,
  Trash2,
  Copy,
  Type,
  FileText,
  Loader2,
  Clock,
  Menu,
  X,
} from "lucide-react";

const TextSummarizer = () => {
  const [summaryLength, setSummaryLength] = useState(50);
  const [mode, setMode] = useState("Paragraph");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [inputType, setInputType] = useState("text");
  const [file, setFile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const userId = localStorage.getItem("userid");
      const response = await axios.get(
        "https://ai-project-2-s7je.onrender.com/api/history",
        {
          params: { userId },
        }
      );
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleSummarize = async () => {
    setIsLoading(true);
    setOutputText("");

    try {
      let response;
      const userId = localStorage.getItem("userid");
      if (inputType === "text") {
        response = await axios.post(
          "https://ai-project-2-s7je.onrender.com/api/summarize-text",
          { text: inputText, userId, summaryLength, mode }
        );
      } else {
        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("userId", userId);
        formData.append("summaryLength", summaryLength);
        formData.append("mode", mode);
        response = await axios.post(
          "https://ai-project-2-s7je.onrender.com/api/summarize-pdf",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }
      setOutputText(response.data.summary);
      fetchHistory();
    } catch (error) {
      console.error("Error:", error);
      setOutputText("An error occurred while summarizing.");
    }

    setIsLoading(false);
  };

  const handleInputTypeChange = (type) => {
    setInputType(type);
    setOutputText("");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
  };

  const handleDownload = () => {
    // const element = document.createElement("a");
    // const file = new Blob([outputText], { type: "text/plain" });
    // element.href = URL.createObjectURL(file);
    // element.download = "summary.txt";
    // document.body.appendChild(element);
    // element.click();
    const element = document.createElement("a");

    // Check if outputText exists and is a string
    const fileContent =
      outputText && typeof outputText === "string" ? outputText : "";

    const file = new Blob([fileContent], { type: "text/plain" });

    element.href = URL.createObjectURL(file);
    element.download = "summary.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  const selectHistoryItem = async (id) => {
    try {
      const userId = localStorage.getItem("userid");
      const response = await axios.get(
        `https://ai-project-2-s7je.onrender.com/api/history/${id}`,
        { params: { userId } }
      );
      setInputType("text");
      setInputText(response.data.input);
      setOutputText(response.data.summary);
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Error fetching history item:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-white w-64 p-4 shadow-lg transition-all duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static top-0 left-0 h-full z-20`}
      >
        <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
          History
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </h2>
        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-6rem)]">
          {history.map((item) => (
            <div
              key={item._id}
              onClick={() => selectHistoryItem(item._id)}
              className="p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors duration-200"
            >
              <p className="font-medium truncate">{item.input.slice(0, 30)}</p>
              <p className="text-sm text-gray-500">
                <Clock size={12} className="inline mr-1" />
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden mb-4 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300"
        >
          <Menu size={24} />
        </button>
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-6">
          <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-[#202F66]">
            AI Text Summarizer
          </h1>

          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div className="flex space-x-2">
              <button
                onClick={() => handleInputTypeChange("text")}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded transition-all duration-300 ${
                  inputType === "text"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                <Type className="mr-2" size={20} />
                Text Input
              </button>
              <button
                onClick={() => handleInputTypeChange("pdf")}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded transition-all duration-300 ${
                  inputType === "pdf"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                <FileText className="mr-2" size={20} />
                PDF Upload
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                className={`flex-1 px-4 py-2 rounded ${
                  mode === "Paragraph"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setMode("Paragraph")}
              >
                Paragraph
              </button>
              <button
                className={`flex-1 px-4 py-2 rounded ${
                  mode === "Bullet Points"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setMode("Bullet Points")}
              >
                Bullet Points
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span>Summary Length:</span>
            <input
              type="range"
              min="10"
              max="90"
              value={summaryLength}
              onChange={(e) => setSummaryLength(e.target.value)}
              className="w-full accent-[#16A34A]"
            />
            <span>{summaryLength}%</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              {inputType === "text" ? (
                <textarea
                  className="w-full h-64 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to summarize..."
                />
              ) : (
                <div className="flex items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg">
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-10 h-10 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PDF (MAX. 800x400px)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf"
                    />
                  </label>
                </div>
              )}
              <div className="flex justify-between mt-2">
                <span>{inputText.split(" ").length} words</span>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                  onClick={handleSummarize}
                  disabled={isLoading || (!inputText && !file)}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Summarizing...
                    </span>
                  ) : (
                    "Summarize"
                  )}
                </button>
              </div>
            </div>
            <div>
              <textarea
                className="w-full h-64 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                value={outputText}
                readOnly
                placeholder="Summary will appear here..."
              />
              <div className="flex justify-between mt-2">
                <span>{outputText.split(" ").length} words</span>
                <div className="space-x-2">
                  <button
                    className="text-blue-600 hover:text-red-800"
                    onClick={handleCopy}
                  >
                    <Copy className="inline-block w-5 h-5" />
                  </button>
                  <button
                    className="text-green-600 hover:text-green-800"
                    onClick={handleDownload}
                  >
                    <Download className="inline-block w-5 h-5" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={handleClear}
                  >
                    <Trash2 className="inline-block w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextSummarizer;
