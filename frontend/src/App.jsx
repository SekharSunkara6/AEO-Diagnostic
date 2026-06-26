import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function GradeCard({ grade, grade_color, message, ranked_count }) {
  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      padding: "32px",
      textAlign: "center",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      marginBottom: "24px"
    }}>
      <div style={{
        fontSize: "80px",
        fontWeight: "900",
        color: grade_color,
        lineHeight: 1,
        marginBottom: "12px"
      }}>
        {grade}
      </div>
      <div style={{
        fontSize: "18px",
        fontWeight: "600",
        color: "#1e293b",
        marginBottom: "8px"
      }}>
        {message}
      </div>
      <div style={{
        fontSize: "14px",
        color: "#64748b"
      }}>
        {ranked_count} out of 3 AI engines recommend your product
      </div>
    </div>
  );
}

function ModelCard({ result }) {
  const colors = {
    "Gemini Flash": { bg: "#eff6ff", border: "#3b82f6", badge: "#3b82f6" },
    "Gemini Pro": { bg: "#f0fdf4", border: "#22c55e", badge: "#22c55e" },
    "GPT-3.5": { bg: "#fdf4ff", border: "#a855f7", badge: "#a855f7" },
  };
  const color = colors[result.model] || { bg: "#f8fafc", border: "#94a3b8", badge: "#94a3b8" };

  return (
    <div style={{
      background: color.bg,
      border: `2px solid ${color.border}`,
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "16px"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px"
      }}>
        <div style={{
          fontWeight: "700",
          fontSize: "16px",
          color: "#1e293b"
        }}>
          {result.model}
        </div>
        <div style={{
          background: result.ranked ? "#22c55e" : "#ef4444",
          color: "white",
          borderRadius: "20px",
          padding: "4px 12px",
          fontSize: "12px",
          fontWeight: "700"
        }}>
          {result.ranked ? `Rank #${result.rank}` : "Not Ranked"}
        </div>
      </div>

      {result.brands.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <div style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#64748b",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            Top Recommendations
          </div>
          {result.brands.map((brand, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 0",
              borderBottom: i < result.brands.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none"
            }}>
              <div style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: color.badge,
                color: "white",
                fontSize: "11px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                {i + 1}
              </div>
              <div style={{
                fontSize: "14px",
                color: "#1e293b",
                fontWeight: result.ranked && result.rank === i + 1 ? "700" : "400"
              }}>
                {brand}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [product, setProduct] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!query.trim() || !product.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${API_URL}/api/analyze`, {
        query: query.trim(),
        product: product.trim()
      });
      setResult(res.data);
    } catch (e) {
      setError("Something went wrong. Make sure the backend is running.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>

      {/* Navbar with brand mark */}
      <div style={{
        background: "rgba(0,0,0,0.25)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <div style={{
          width: "28px",
          height: "28px",
          borderRadius: "8px",
          background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "900",
          fontSize: "15px",
          color: "white"
        }}>
          A
        </div>
        <span style={{
          fontWeight: "800",
          fontSize: "16px",
          color: "white",
          letterSpacing: "0.02em"
        }}>
          AEO Diagnostic
        </span>
      </div>

      {/* Main Content */}
      <div style={{ padding: "40px 20px" }}>
        <div style={{
          maxWidth: "720px",
          margin: "0 auto"
        }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1 style={{
              fontSize: "42px",
              fontWeight: "900",
              color: "white",
              margin: "0 0 12px 0",
              lineHeight: 1.1
            }}>
              AEO Diagnostic
            </h1>
            <p style={{
              fontSize: "17px",
              color: "rgba(255,255,255,0.8)",
              margin: 0
            }}>
              Does your content exist to an AI agent? Find out in seconds.
            </p>
          </div>

          {/* Input Card */}
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            marginBottom: "24px"
          }}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "700",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "8px"
              }}>
                Query a user or agent might ask
              </label>
              <input
                type="text"
                placeholder='e.g. "best tool for building RAG pipelines in production"'
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "#667eea"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "700",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "8px"
              }}>
                Your brand, product, or content topic
              </label>
              <input
                type="text"
                placeholder='e.g. "LangChain"'
                value={product}
                onChange={e => setProduct(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  fontSize: "15px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "#667eea"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                onKeyDown={e => e.key === "Enter" && handleAnalyze()}
              />
            </div>

            {error && (
              <div style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "12px 16px",
                color: "#dc2626",
                fontSize: "14px",
                marginBottom: "16px"
              }}>
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading ? "#94a3b8" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "opacity 0.2s"
              }}
            >
              {loading ? "Querying 3 AI Engines..." : "Run AEO Diagnostic →"}
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "40px",
              textAlign: "center",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
            }}>
              <div style={{
                fontSize: "32px",
                marginBottom: "16px"
              }}>⚡</div>
              <div style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "8px"
              }}>
                Querying Gemini Flash, Gemini Pro & GPT-3.5...
              </div>
              <div style={{
                fontSize: "14px",
                color: "#64748b"
              }}>
                This takes about 10 seconds
              </div>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div>
              <GradeCard
                grade={result.grade}
                grade_color={result.grade_color}
                message={result.message}
                ranked_count={result.ranked_count}
              />
              <div style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "rgba(255,255,255,0.8)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "12px",
                paddingLeft: "4px"
              }}>
                AI Engine Breakdown
              </div>
              {result.results.map((r, i) => (
                <ModelCard key={i} result={r} />
              ))}

              <div style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: "12px",
                padding: "16px 20px",
                marginTop: "8px"
              }}>
                <div style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.9)",
                  textAlign: "center"
                }}>
                  💡 <strong>What is AEO?</strong> Answer Engine Optimization — writing content that AI agents can parse, understand, and act on.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
