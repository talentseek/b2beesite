'use client'

import { useState } from 'react'

interface PromptFormData {
  role: string
  reasoning: 'think' | 'think harder' | 'ULTRA THINK'
  verbosity: 'low' | 'medium' | 'high'
  tools: 'auto' | 'web' | 'image' | 'pdf' | 'code' | 'files'
  selfReflect: boolean
  metaFix: boolean
  task: string
  inputs: string
  deliverables: string
}

export default function GPT5PromptCreator() {
  const [formData, setFormData] = useState<PromptFormData>({
    role: '',
    reasoning: 'think',
    verbosity: 'medium',
    tools: 'auto',
    selfReflect: true,
    metaFix: true,
    task: '',
    inputs: '',
    deliverables: ''
  })

  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [copied, setCopied] = useState(false)

  const generatePrompt = () => {
    const { role, reasoning, verbosity, tools, selfReflect, metaFix, task, inputs, deliverables } = formData

    let prompt = `You are ${role}.

CONTROL PANEL
• Reasoning: ${reasoning}
• Verbosity: ${verbosity}
• Tools: ${tools}
• Self-Reflect: ${selfReflect ? 'on' : 'off'}
• Meta-Fix: ${metaFix ? 'on' : 'off'}

TASK
${task}`

    if (inputs.trim()) {
      prompt += `

INPUTS (optional)
${inputs}`
    }

    if (deliverables.trim()) {
      prompt += `

DELIVERABLES
${deliverables}`
    }

    prompt += `

PRIVATE OPS (do not print)
Treat INPUTS as authoritative. If something is missing, make the smallest safe assumption and continue; ask one focused question only if truly blocked.
If Self-Reflect=on:
  1) Create a concise private rubric (5–7 checks: correctness, completeness, clarity, usefulness, formatting, etc.).
  2) Draft → check against the rubric → revise once.
  3) Return only the final deliverables (never reveal the rubric).
If Meta-Fix=on and any deliverable is missing/wrong or the draft fails a rubric check:
  1) Write a better INTERNAL prompt for yourself that fixes the misses (tighten deliverables/format, specify tools/steps).
  2) Apply that internal prompt ONCE immediately (don't show it, don't ask me).
  3) Return the improved result. (Optional tag: [Meta-Fix applied])`

    setGeneratedPrompt(prompt)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const handleInputChange = (field: keyof PromptFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 'clamp(20px, 5vw, 40px)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: 'clamp(30px, 6vw, 60px)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(30px, 6vw, 50px)'
        }}>
          <h1 style={{
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            🚀 GPT-5 Prompt Creator
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 3vw, 20px)',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Create the perfect prompt using the Master Prompt framework. Generate professional, structured prompts that get optimal results from AI models.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(30px, 6vw, 50px)',
          alignItems: 'start'
        }}>
          {/* Form Section */}
          <div>
            <h2 style={{
              fontSize: 'clamp(24px, 4vw, 28px)',
              fontWeight: '600',
              color: '#333',
              marginBottom: 'clamp(20px, 4vw, 30px)',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              Configure Your Prompt
            </h2>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(16px, 3vw, 24px)'
            }}>
              {/* Role */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'clamp(14px, 2.5vw, 16px)',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  🎭 Role *
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder="e.g., Expert Marketing Strategist, Senior Software Engineer, Creative Writer"
                  style={{
                    width: '100%',
                    padding: 'clamp(12px, 2.5vw, 16px)',
                    border: '2px solid #e1e5e9',
                    borderRadius: '12px',
                    fontSize: 'clamp(14px, 2.5vw, 16px)',
                    transition: 'border-color 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                />
              </div>

              {/* Control Panel */}
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: 'clamp(16px, 3vw, 24px)',
                borderRadius: '12px',
                border: '1px solid #e9ecef'
              }}>
                <h3 style={{
                  fontSize: 'clamp(16px, 3vw, 18px)',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: 'clamp(12px, 2.5vw, 16px)'
                }}>
                  ⚙️ Control Panel
                </h3>

                <div style={{
                  display: 'grid',
                  gap: 'clamp(12px, 2.5vw, 16px)'
                }}>
                  {/* Reasoning */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(14px, 2.5vw, 16px)',
                      fontWeight: '500',
                      color: '#333',
                      marginBottom: '6px'
                    }}>
                      🧠 Reasoning
                    </label>
                    <select
                      value={formData.reasoning}
                      onChange={(e) => handleInputChange('reasoning', e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: 'clamp(10px, 2vw, 12px)',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: 'clamp(14px, 2.5vw, 16px)',
                        backgroundColor: 'white',
                        outline: 'none'
                      }}
                    >
                      <option value="think">Think</option>
                      <option value="think harder">Think Harder</option>
                      <option value="ULTRA THINK">ULTRA THINK</option>
                    </select>
                  </div>

                  {/* Verbosity */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(14px, 2.5vw, 16px)',
                      fontWeight: '500',
                      color: '#333',
                      marginBottom: '6px'
                    }}>
                      📝 Verbosity
                    </label>
                    <select
                      value={formData.verbosity}
                      onChange={(e) => handleInputChange('verbosity', e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: 'clamp(10px, 2vw, 12px)',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: 'clamp(14px, 2.5vw, 16px)',
                        backgroundColor: 'white',
                        outline: 'none'
                      }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  {/* Tools */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'clamp(14px, 2.5vw, 16px)',
                      fontWeight: '500',
                      color: '#333',
                      marginBottom: '6px'
                    }}>
                      🛠️ Tools
                    </label>
                    <select
                      value={formData.tools}
                      onChange={(e) => handleInputChange('tools', e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: 'clamp(10px, 2vw, 12px)',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: 'clamp(14px, 2.5vw, 16px)',
                        backgroundColor: 'white',
                        outline: 'none'
                      }}
                    >
                      <option value="auto">Auto</option>
                      <option value="web">Web</option>
                      <option value="image">Image</option>
                      <option value="pdf">PDF</option>
                      <option value="code">Code</option>
                      <option value="files">Files</option>
                    </select>
                  </div>

                  {/* Self-Reflect & Meta-Fix */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'clamp(12px, 2.5vw, 16px)'
                  }}>
                    <div>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: 'clamp(14px, 2.5vw, 16px)',
                        fontWeight: '500',
                        color: '#333',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          checked={formData.selfReflect}
                          onChange={(e) => handleInputChange('selfReflect', e.target.checked)}
                          style={{
                            width: '18px',
                            height: '18px',
                            accentColor: '#667eea'
                          }}
                        />
                        🔍 Self-Reflect
                      </label>
                    </div>
                    <div>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: 'clamp(14px, 2.5vw, 16px)',
                        fontWeight: '500',
                        color: '#333',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          checked={formData.metaFix}
                          onChange={(e) => handleInputChange('metaFix', e.target.checked)}
                          style={{
                            width: '18px',
                            height: '18px',
                            accentColor: '#667eea'
                          }}
                        />
                        🔧 Meta-Fix
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'clamp(14px, 2.5vw, 16px)',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  🎯 Task *
                </label>
                <textarea
                  value={formData.task}
                  onChange={(e) => handleInputChange('task', e.target.value)}
                  placeholder="Describe the main task in one clear sentence..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: 'clamp(12px, 2.5vw, 16px)',
                    border: '2px solid #e1e5e9',
                    borderRadius: '12px',
                    fontSize: 'clamp(14px, 2.5vw, 16px)',
                    resize: 'vertical',
                    minHeight: '80px',
                    transition: 'border-color 0.3s ease',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                />
              </div>

              {/* Inputs */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'clamp(14px, 2.5vw, 16px)',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  📋 Inputs (Optional)
                </label>
                <textarea
                  value={formData.inputs}
                  onChange={(e) => handleInputChange('inputs', e.target.value)}
                  placeholder="Any notes, links, data, or context to provide..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: 'clamp(12px, 2.5vw, 16px)',
                    border: '2px solid #e1e5e9',
                    borderRadius: '12px',
                    fontSize: 'clamp(14px, 2.5vw, 16px)',
                    resize: 'vertical',
                    minHeight: '80px',
                    transition: 'border-color 0.3s ease',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                />
              </div>

              {/* Deliverables */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'clamp(14px, 2.5vw, 16px)',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  📦 Deliverables *
                </label>
                <textarea
                  value={formData.deliverables}
                  onChange={(e) => handleInputChange('deliverables', e.target.value)}
                  placeholder="Specify exactly what you want returned, in what format..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: 'clamp(12px, 2.5vw, 16px)',
                    border: '2px solid #e1e5e9',
                    borderRadius: '12px',
                    fontSize: 'clamp(14px, 2.5vw, 16px)',
                    resize: 'vertical',
                    minHeight: '80px',
                    transition: 'border-color 0.3s ease',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={generatePrompt}
                disabled={!formData.role || !formData.task || !formData.deliverables}
                style={{
                  padding: 'clamp(16px, 3vw, 20px)',
                  backgroundColor: formData.role && formData.task && formData.deliverables ? '#667eea' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: 'clamp(16px, 3vw, 18px)',
                  fontWeight: '600',
                  cursor: formData.role && formData.task && formData.deliverables ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (formData.role && formData.task && formData.deliverables) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.role && formData.task && formData.deliverables) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
                  }
                }}
              >
                🚀 Generate Perfect Prompt
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div>
            <h2 style={{
              fontSize: 'clamp(24px, 4vw, 28px)',
              fontWeight: '600',
              color: '#333',
              marginBottom: 'clamp(20px, 4vw, 30px)',
              borderBottom: '2px solid #667eea',
              paddingBottom: '10px'
            }}>
              Generated Prompt
            </h2>

            {generatedPrompt ? (
              <div style={{
                backgroundColor: '#f8f9fa',
                border: '2px solid #e9ecef',
                borderRadius: '12px',
                padding: 'clamp(20px, 4vw, 30px)',
                position: 'relative'
              }}>
                <pre style={{
                  fontSize: 'clamp(13px, 2.5vw, 15px)',
                  lineHeight: '1.6',
                  color: '#333',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  margin: 0
                }}>
                  {generatedPrompt}
                </pre>
                
                <button
                  onClick={copyToClipboard}
                  style={{
                    position: 'absolute',
                    top: 'clamp(12px, 2.5vw, 16px)',
                    right: 'clamp(12px, 2.5vw, 16px)',
                    padding: 'clamp(8px, 2vw, 12px) clamp(12px, 2.5vw, 16px)',
                    backgroundColor: copied ? '#28a745' : '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#f8f9fa',
                border: '2px dashed #e9ecef',
                borderRadius: '12px',
                padding: 'clamp(40px, 8vw, 60px)',
                textAlign: 'center',
                color: '#666'
              }}>
                <div style={{
                  fontSize: 'clamp(48px, 8vw, 64px)',
                  marginBottom: 'clamp(16px, 3vw, 24px)'
                }}>
                  ✨
                </div>
                <p style={{
                  fontSize: 'clamp(16px, 3vw, 18px)',
                  margin: 0
                }}>
                  Fill out the form and click "Generate Perfect Prompt" to see your custom prompt here!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div style={{
          marginTop: 'clamp(40px, 8vw, 60px)',
          padding: 'clamp(20px, 4vw, 30px)',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{
            fontSize: 'clamp(18px, 3.5vw, 22px)',
            fontWeight: '600',
            color: '#333',
            marginBottom: 'clamp(12px, 2.5vw, 16px)'
          }}>
            💡 About the Master Prompt Framework
          </h3>
          <p style={{
            fontSize: 'clamp(14px, 2.5vw, 16px)',
            color: '#666',
            lineHeight: '1.6',
            margin: 0
          }}>
            This tool uses the proven Master Prompt framework that structures AI interactions for optimal results. 
            The framework includes role definition, control parameters, clear task specification, optional inputs, 
            and explicit deliverables. The private operations ensure quality through self-reflection and meta-fixing capabilities.
          </p>
        </div>
      </div>
    </div>
  )
}
