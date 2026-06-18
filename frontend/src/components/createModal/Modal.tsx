import React, { useState, useEffect } from "react";
import { addJob } from "../../http/http";
import { enqueueSnackbar } from "notistack";
import PulseLoader from "react-spinners/PulseLoader";

interface ModalProps {
  setShowModal: (show: boolean) => void;
  getAllJobsData: () => Promise<void> | void;
}

interface JobFormData {
  company: string;
  position: string;
  workLocation: string;
  workType: string;
  status: string;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "38px",
  padding: "0 12px",
  background: "rgba(255,255,255,0.04)",
  border: "0.5px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  fontSize: "13px",
  color: "#fff",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none" as any,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='rgba(255,255,255,0.3)' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  backgroundSize: "14px",
  paddingRight: "32px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 500,
  color: "rgba(255,255,255,0.4)",
  marginBottom: "5px",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

const Modal: React.FC<ModalProps> = ({ setShowModal, getAllJobsData }) => {
  const [formData, setFormData] = useState<JobFormData>({
    company: "", position: "", workLocation: "", workType: "", status: "",
  });
  const [loading, setLoading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setShowModal(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "rgba(34,197,94,0.5)";
    e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.08)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.1)";
    e.target.style.boxShadow = "none";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.position) {
      enqueueSnackbar("Company and position are required.", { variant: "warning" });
      return;
    }
    try {
      setLoading(true);
      const payload = {
        companyName: formData.company,
        jobTitle: formData.position,
        jobType: formData.workType,
        workLocation: formData.workLocation,
        status: formData.status,
        appliedDate: new Date().toISOString(),
      };
      const { data } = await addJob(payload);
      getAllJobsData();
      enqueueSnackbar(data?.message || "Job tracked successfully!", { variant: "success" });
      setShowModal(false);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Could not save job application.";
      enqueueSnackbar(msg, { variant: "error" });
    } finally {
      setLoading(false);
      setFormData({ company: "", position: "", workLocation: "", workType: "", status: "" });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "#12141c",
          border: "0.5px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(34,197,94,0.1)", border: "0.5px solid rgba(34,197,94,0.2)" }}
            >
              <svg className="w-4 h-4" style={{ color: "#22c55e" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Track new application</h3>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Fill in the job details below</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Company</label>
              <input
                type="text" name="company" placeholder="e.g. Nvidia"
                value={formData.company} onChange={handleChange}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Position</label>
              <input
                type="text" name="position" placeholder="e.g. Fullstack Engineer"
                value={formData.position} onChange={handleChange}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Work type</label>
              <select
                name="workType" value={formData.workType} onChange={handleChange}
                style={selectStyle} onFocus={focusStyle} onBlur={blurStyle}
              >
                <option value="">Select type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select
                name="status" value={formData.status} onChange={handleChange}
                style={selectStyle} onFocus={focusStyle} onBlur={blurStyle}
              >
                <option value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="interview">Interview</option>
                <option value="reject">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Location</label>
            <input
              type="text" name="workLocation" placeholder="e.g. Santa Clara, CA or Remote"
              value={formData.workLocation} onChange={handleChange}
              style={inputStyle} onFocus={focusStyle} onBlur={blurStyle}
            />
          </div>

          {/* Footer actions */}
          <div
            className="flex items-center justify-end gap-3 pt-2"
            style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-lg text-sm transition-colors"
              style={{
                color: "rgba(255,255,255,0.4)",
                background: "rgba(255,255,255,0.04)",
                border: "0.5px solid rgba(255,255,255,0.08)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all min-w-[110px]"
              style={{
                background: loading ? "rgba(34,197,94,0.4)" : "#22c55e",
                color: "#0a1a0e",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <PulseLoader color="#0a1a0e" size={6} margin={2} />
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Track Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;