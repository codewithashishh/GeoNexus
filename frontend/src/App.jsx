import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  CloudUpload,
  Database,
  FileCheck2,
  FileText,
  Home,
  Menu,
  RefreshCw,
  Search,
  ShieldCheck,
  Upload,
  UserCheck,
  X,
  AlertTriangle
} from "lucide-react";
import {
  getDashboard,
  getRecords,
  processRecord,
  saveRecord,
  validateRecord
} from "./services/api";

const fields = [
  ["ownerName", "Owner Name"],
  ["khataNumber", "Khata Number"],
  ["plotNumber", "Plot Number"],
  ["area", "Area"],
  ["village", "Village"],
  ["district", "District"],
  ["state", "State"]
];

const sampleRecord = {
  ownerName: "Ramesh Kumar",
  khataNumber: "1245",
  plotNumber: "367/2",
  area: "0.42 Acre",
  village: "Baripada",
  district: "Mayurbhanj",
  state: "Odisha"
};

const sampleConfidence = {
  ownerName: 96,
  khataNumber: 98,
  plotNumber: 94,
  area: 68,
  village: 93,
  district: 54,
  state: 97
};

function App() {
  const [record, setRecord] = useState(null);
  const [confidence, setConfidence] = useState({});
  const [validation, setValidation] = useState(null);
  const [verified, setVerified] = useState({});
  const [demoSource, setDemoSource] = useState("");
  const [toast, setToast] = useState("");

  function notify(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2800);
  }

  function loadProcessed(data) {
    setRecord(data.record);
    setConfidence(data.confidence);
    setDemoSource(data.source);
    setValidation(null);
    setVerified({});
  }

  function updateField(key, value) {
    setRecord((current) => ({ ...current, [key]: value }));
    setVerified((current) => ({ ...current, [key]: false }));
  }

  function markVerified(key) {
    setVerified((current) => ({ ...current, [key]: true }));
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <Topbar />
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={<DashboardPage notify={notify} />}
            />
            <Route
              path="/process"
              element={
                <ProcessPage
                  onProcessed={loadProcessed}
                  notify={notify}
                />
              }
            />
            <Route
              path="/extracted"
              element={
                <ExtractedPage
                  record={record}
                  confidence={confidence}
                  demoSource={demoSource}
                  onValidate={async () => {
                    const result = await validateRecord(record, confidence);
                    setValidation(result);
                    notify("Validation completed");
                  }}
                />
              }
            />
            <Route
              path="/verify"
              element={
                <VerificationPage
                  record={record}
                  confidence={confidence}
                  validation={validation}
                  verified={verified}
                  updateField={updateField}
                  markVerified={markVerified}
                  onComplete={() => {
                    setVerified(
                      Object.fromEntries(fields.map(([key]) => [key, true]))
                    );
                  }}
                />
              }
            />
            <Route
              path="/verified"
              element={
                <VerifiedPage
                  record={record}
                  confidence={confidence}
                  verified={verified}
                  onSave={async () => {
                    await saveRecord({
                      ...record,
                      status: "Verified"
                    });
                    notify("Record saved successfully");
                  }}
                  onEdit={() => setVerified({})}
                />
              }
            />
            <Route path="/records" element={<RecordsPage />} />
            <Route path="*" element={<DashboardPage notify={notify} />} />
          </Routes>
        </div>
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function Sidebar() {
  const nav = [
    ["/", "Dashboard", Home],
    ["/process", "Process Record", CloudUpload],
    ["/records", "Verified Records", Database]
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">G</div>
        <div>
          <strong>GeoNexus</strong>
          <span>Land Intelligence</span>
        </div>
      </div>

      <nav>
        {nav.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="mini-status">
          <span className="status-dot" />
          <div>
            <strong>Prototype Demo</strong>
            <small>System operational</small>
          </div>
        </div>
        <div className="sih-badge">SIH 2026 • SIH26018</div>
      </div>
    </aside>
  );
}

function Topbar() {
  const location = useLocation();
  const titles = {
    "/": ["Overview", "Land record digitization workspace"],
    "/process": ["Process Record", "Digitize and validate a land record"],
    "/extracted": ["Extracted Record", "Review fields extracted from the document"],
    "/verify": ["Human Verification", "Confirm uncertain information"],
    "/verified": ["Verified Record", "Final digital record"],
    "/records": ["Records", "Saved digital land records"]
  };

  const [title, subtitle] = titles[location.pathname] || titles["/"];

  return (
    <header className="topbar">
      <div>
        <div className="eyebrow">GEONEXUS / {title.toUpperCase()}</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-right">
        <div className="secure-pill">
          <ShieldCheck size={16} />
          Prototype Environment
        </div>
      </div>
    </header>
  );
}

function DashboardPage({ notify }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDashboard().then(setData).catch(() => {});
  }, []);

  const stats = data?.stats || { total: 24, verified: 18, review: 6 };
  const recent = data?.recentRecords || [];

  return (
    <>
      <section className="hero-card">
        <div className="hero-copy">
          <span className="hero-kicker">INTELLIGENT LAND RECORD WORKFLOW</span>
          <h2>From scanned document to a verified digital record.</h2>
          <p>
            GeoNexus combines document extraction, confidence scoring,
            rule-based validation and human verification in one simple workflow.
          </p>
          <Link className="primary-btn" to="/process">
            Process New Record <ArrowRight size={18} />
          </Link>
        </div>
        <div className="hero-graphic">
          <div className="document-icon"><FileText size={46} /></div>
          <div className="graphic-line" />
          <div className="shield-icon"><ShieldCheck size={42} /></div>
          <div className="graphic-label">DIGITIZE → VALIDATE → VERIFY</div>
        </div>
      </section>

      <section className="pipeline">
        <PipelineItem icon={Upload} title="Upload" text="Land record" />
        <ChevronRight className="pipeline-arrow" />
        <PipelineItem icon={RefreshCw} title="Extract" text="Prototype OCR" />
        <ChevronRight className="pipeline-arrow" />
        <PipelineItem icon={ClipboardCheck} title="Validate" text="Rule engine" />
        <ChevronRight className="pipeline-arrow" />
        <PipelineItem icon={UserCheck} title="Verify" text="Human review" />
        <ChevronRight className="pipeline-arrow" />
        <PipelineItem icon={Database} title="Save" text="Digital record" />
      </section>

      <div className="section-heading">
        <div>
          <h3>System overview</h3>
          <p>Current prototype activity</p>
        </div>
      </div>

      <section className="stats-grid">
        <StatCard label="Total records processed" value={stats.total} icon={FileCheck2} />
        <StatCard label="Verified records" value={stats.verified} icon={CheckCircle2} />
        <StatCard label="Requiring review" value={stats.review} icon={AlertTriangle} />
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Recent records</h3>
            <p>Synthetic records used for prototype demonstration</p>
          </div>
          <Link className="text-btn" to="/records">View all <ArrowRight size={16} /></Link>
        </div>
        <RecordTable records={recent.length ? recent : [
          sampleRecord,
          { ...sampleRecord, ownerName: "Sunita Das", khataNumber: "2891", plotNumber: "118", village: "Balasore", district: "Balasore", status: "Needs Review" }
        ]} />
      </section>
    </>
  );
}

function PipelineItem({ icon: Icon, title, text }) {
  return (
    <div className="pipeline-item">
      <div className="pipeline-icon"><Icon size={18} /></div>
      <div>
        <strong>{title}</strong>
        <small>{text}</small>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="stat-card">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="stat-icon"><Icon size={20} /></div>
    </div>
  );
}

function ProcessPage({ onProcessed, notify }) {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  async function startProcess(selectedFile = file) {
    setProcessing(true);

    try {
      const data = await processRecord(selectedFile);
      onProcessed(data);
      navigate("/extracted");
      notify("Record extraction completed");
    } catch (error) {
      notify(error.message);
    } finally {
      setProcessing(false);
    }
  }

  function loadSample() {
    onProcessed({
      record: sampleRecord,
      confidence: sampleConfidence,
      source: "Sample Synthetic Land Record"
    });
    navigate("/extracted");
  }

  return (
    <section className="process-layout">
      <div className="process-main">
        <div className="page-intro">
          <span className="hero-kicker">STEP 01 / DOCUMENT INPUT</span>
          <h2>Upload a land record</h2>
          <p>Supported formats: JPG, PNG and PDF. Synthetic documents are recommended for the demo.</p>
        </div>

        <label
          className={`dropzone ${file ? "has-file" : ""}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setFile(e.dataTransfer.files[0]);
          }}
        >
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <div className="upload-ring"><CloudUpload size={30} /></div>
          {file ? (
            <>
              <h3>{file.name}</h3>
              <p>{(file.size / 1024).toFixed(1)} KB • Ready to process</p>
            </>
          ) : (
            <>
              <h3>Drop your document here</h3>
              <p>or click to browse files</p>
            </>
          )}
          <span className="file-types">JPG • PNG • PDF</span>
        </label>

        <div className="process-actions">
          <button className="secondary-btn" onClick={loadSample}>
            <FileText size={17} /> Load Sample Record
          </button>
          <button className="primary-btn" onClick={() => startProcess()} disabled={processing}>
            {processing ? <><RefreshCw size={17} className="spin" /> Processing...</> : <>Process Record <ArrowRight size={17} /></>}
          </button>
        </div>
      </div>

      <aside className="info-card">
        <div className="info-icon"><ShieldCheck size={21} /></div>
        <h3>Prototype Demo Mode</h3>
        <p>
          OCR is simulated in this hackathon prototype so the full workflow
          can be demonstrated reliably without production OCR infrastructure.
        </p>
        <div className="info-list">
          <div><Check size={15} /> Extraction workflow</div>
          <div><Check size={15} /> Confidence scoring</div>
          <div><Check size={15} /> Validation rules</div>
          <div><Check size={15} /> Human verification</div>
        </div>
      </aside>
    </section>
  );
}

function ExtractedPage({ record, confidence, demoSource, onValidate }) {
  const navigate = useNavigate();

  if (!record) {
    return <EmptyState text="No processed record yet." action="/process" />;
  }

  return (
    <>
      <div className="notice">
        <FileText size={17} />
        <div>
          <strong>Prototype Demo OCR</strong>
          <span>{demoSource || "Synthetic sample data"} • OCR output is simulated for demonstration.</span>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <h3>Extracted fields</h3>
          <p>Confidence scores help identify information requiring human review.</p>
        </div>
      </div>

      <FieldTable
        record={record}
        confidence={confidence}
        showValidation={false}
      />

      <div className="bottom-actions">
        <button className="secondary-btn" onClick={() => navigate("/process")}>Back</button>
        <button
          className="primary-btn"
          onClick={async () => {
            await onValidate();
            navigate("/verify");
          }}
        >
          Run Validation Engine <ArrowRight size={17} />
        </button>
      </div>
    </>
  );
}

function VerificationPage({
  record,
  confidence,
  validation,
  verified,
  updateField,
  markVerified,
  onComplete
}) {
  const navigate = useNavigate();

  if (!record) {
    return <EmptyState text="No record available for verification." action="/process" />;
  }

  const needsReview = fields.filter(([key]) => {
    const status = validation?.results?.[key]?.status;
    return status === "review" || status === "invalid" || status === "missing";
  });

  const allVerified = fields.every(([key]) => verified[key]);

  return (
    <>
      <div className="verification-banner">
        <div className="verification-icon"><UserCheck size={23} /></div>
        <div>
          <strong>Human-in-the-loop verification</strong>
          <p>
            Review flagged fields, correct them if necessary, and explicitly verify
            the final values before saving.
          </p>
        </div>
        <div className="review-count">
          {needsReview.length} <span>fields flagged</span>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <h3>Review extracted information</h3>
          <p>Green fields have been explicitly verified by a human.</p>
        </div>
      </div>

      <div className="verification-list">
        {fields.map(([key, label]) => {
          const score = confidence[key] ?? 0;
          const result = validation?.results?.[key];
          const flagged = result?.status === "review" || result?.status === "invalid" || result?.status === "missing";
          const isVerified = verified[key];

          return (
            <div className={`verify-card ${flagged && !isVerified ? "flagged" : ""} ${isVerified ? "verified" : ""}`} key={key}>
              <div className="verify-card-top">
                <div>
                  <span className="field-label">{label}</span>
                  <span className={`confidence ${confidenceClass(score)}`}>
                    {score}% confidence
                  </span>
                </div>
                {isVerified ? (
                  <span className="verified-label"><CheckCircle2 size={16} /> Verified</span>
                ) : flagged ? (
                  <span className="review-label"><AlertTriangle size={16} /> Needs Review</span>
                ) : (
                  <span className="valid-label"><CheckCircle2 size={16} /> Valid</span>
                )}
              </div>

              <div className="verify-input-row">
                <input
                  value={record[key] ?? ""}
                  onChange={(e) => updateField(key, e.target.value)}
                />
                <button
                  className={isVerified ? "verify-btn verified-btn" : "verify-btn"}
                  onClick={() => markVerified(key)}
                >
                  {isVerified ? <><Check size={16} /> Verified</> : <><UserCheck size={16} /> Verify Field</>}
                </button>
              </div>

              {result?.message && (
                <small className="field-message">{result.message}</small>
              )}
            </div>
          );
        })}
      </div>

      <div className="bottom-actions">
        <button className="secondary-btn" onClick={() => navigate("/extracted")}>Back to Extraction</button>
        <button
          className="primary-btn"
          disabled={!allVerified}
          onClick={() => {
            onComplete();
            navigate("/verified");
          }}
        >
          Verify Complete Record <CheckCircle2 size={17} />
        </button>
      </div>

      {!allVerified && (
        <p className="action-hint">
          Verify each field above before completing the record.
        </p>
      )}
    </>
  );
}

function VerifiedPage({ record, confidence, onSave, onEdit }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  if (!record) {
    return <EmptyState text="No verified record yet." action="/process" />;
  }

  function exportRecord() {
    const blob = new Blob([JSON.stringify(record, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "geonexus-verified-record.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="success-card">
        <div className="success-check"><Check size={30} /></div>
        <div>
          <span className="hero-kicker">VERIFICATION COMPLETE</span>
          <h2>Record Successfully Verified</h2>
          <p>The extracted information has passed the prototype validation and human verification workflow.</p>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <h3>Verified digital record</h3>
          <p>Final structured representation ready for storage/export.</p>
        </div>
        <span className="status-chip verified">✓ Verified</span>
      </div>

      <div className="record-card">
        {fields.map(([key, label]) => (
          <div className="record-detail" key={key}>
            <span>{label}</span>
            <strong>{record[key]}</strong>
            <small>{confidence[key]}% confidence</small>
          </div>
        ))}
      </div>

      <div className="bottom-actions">
        <button
          className="secondary-btn"
          onClick={() => {
            onEdit();
            navigate("/verify");
          }}
        >
          Edit Record
        </button>
        <button className="secondary-btn" onClick={exportRecord}>
          Export Record
        </button>
        <button
          className="primary-btn"
          onClick={async () => {
            await onSave();
            setSaved(true);
          }}
        >
          <Database size={17} /> {saved ? "Saved to Database" : "Save Record"}
        </button>
      </div>

      {saved && (
        <div className="saved-note">
          <CheckCircle2 size={17} />
          Record saved to the prototype database successfully.
        </div>
      )}
    </>
  );
}

function RecordsPage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    getRecords().then((data) => setRecords(data.records)).catch(() => {});
  }, []);

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h3>Saved land records</h3>
          <p>Prototype database • synthetic data only</p>
        </div>
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search records..." />
        </div>
      </div>
      <RecordTable records={records} />
    </section>
  );
}

function FieldTable({ record, confidence }) {
  return (
    <div className="panel field-panel">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Extracted value</th>
              <th>Confidence</th>
              <th>Initial status</th>
            </tr>
          </thead>
          <tbody>
            {fields.map(([key, label]) => {
              const score = confidence[key] ?? 0;
              return (
                <tr key={key}>
                  <td className="field-name">{label}</td>
                  <td className="value-cell">{record[key] || "—"}</td>
                  <td>
                    <div className="confidence-cell">
                      <div className="progress"><span style={{ width: `${score}%` }} /></div>
                      <strong>{score}%</strong>
                    </div>
                  </td>
                  <td>
                    <span className={`status-chip ${score < 70 ? "review" : score < 85 ? "medium" : "verified"}`}>
                      {score < 70 ? "⚠ Review" : score < 85 ? "Review Recommended" : "✓ High Confidence"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RecordTable({ records }) {
  if (!records?.length) {
    return <div className="empty-table">No saved records yet.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Owner Name</th>
            <th>Khata</th>
            <th>Plot</th>
            <th>Area</th>
            <th>Village</th>
            <th>District</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={record.id || index}>
              <td className="field-name">{record.ownerName}</td>
              <td>{record.khataNumber}</td>
              <td>{record.plotNumber}</td>
              <td>{record.area}</td>
              <td>{record.village}</td>
              <td>{record.district}</td>
              <td>
                <span className={`status-chip ${record.status === "Verified" ? "verified" : "review"}`}>
                  {record.status === "Verified" ? "✓ Verified" : "⚠ Needs Review"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ text, action }) {
  return (
    <div className="empty-state">
      <FileText size={34} />
      <h3>{text}</h3>
      <Link to={action} className="primary-btn">Start Processing <ArrowRight size={17} /></Link>
    </div>
  );
}

function confidenceClass(score) {
  if (score >= 85) return "high";
  if (score >= 70) return "medium";
  return "low";
}

export default App;
