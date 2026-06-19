import React, { useState } from 'react';
import { 
  Folder, FolderOpen, FileText, UploadCloud, Settings, 
  CheckCircle, AlertCircle, ChevronRight, ChevronDown, 
  File, Search, Link as LinkIcon, Info, ShieldCheck, 
  Clock, User, FileSignature, Lock, Filter, Download, 
  Eye, Database, AlertTriangle, XCircle, RefreshCw, LayoutTree,
  Building, Hash, Calendar, LayoutDashboard, Activity
} from 'lucide-react';

// --- COMPONENT 1: DOSSIER BUILDER ---
function DossierBuilder() {
  const [treeData] = useState([
    {
      id: 'm1', title: 'Module 1 - Regional', type: 'folder', isOpen: true,
      children: [{ id: 'm1-us', title: '1.14 Labeling', type: 'folder', isOpen: false, children: [] }]
    },
    { id: 'm2', title: 'Module 2 - Summaries', type: 'folder', isOpen: false, children: [] },
    {
      id: 'm3', title: 'Module 3 - Quality', type: 'folder', isOpen: true,
      children: [
        {
          id: 'm3-s', title: '3.2.S Drug Substance', type: 'folder', isOpen: true,
          children: [
            {
              id: 'm3-s-1', title: '3.2.S.1 General Information', type: 'folder', isOpen: true,
              children: [
                { 
                  id: 'cou-9a8b7c', title: 'nomenclature-v2.pdf', type: 'file', 
                  lifecycle: 'Replace', docUuid: 'doc-11223344', status: 'valid'
                }
              ]
            }
          ]
        }
      ]
    }
  ]);

  const [selectedNode, setSelectedNode] = useState(null);
  const stagedFiles = [
    { id: 'doc-556677', name: 'hplc_validation_report.pdf', hash: 'e4d909c290d0fb1ca068ffaddf22cbd0', size: '1.2 MB' },
    { id: 'doc-889900', name: 'batch_analysis_001.pdf', hash: '8b1a9953c4611296a827abf8c47804d7', size: '845 KB' }
  ];

  const renderTree = (nodes, level = 0) => {
    return nodes.map(node => (
      <div key={node.id} className="select-none">
        <div 
          className={`flex items-center py-1 px-2 cursor-pointer text-sm rounded-md mb-0.5
            ${selectedNode?.id === node.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'}`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => setSelectedNode(node)}
        >
          <span className="w-4 h-4 mr-1 text-slate-400">
            {node.type === 'folder' ? (node.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : <span className="w-4 inline-block"></span>}
          </span>
          <span className="mr-2 text-slate-500">
            {node.type === 'folder' ? (node.isOpen ? <FolderOpen size={16} className="text-blue-500" /> : <Folder size={16} className="text-blue-500" />) : <FileText size={16} className={node.lifecycle === 'Replace' ? 'text-orange-500' : 'text-slate-500'} />}
          </span>
          <span className="truncate font-medium">{node.title}</span>
          {node.type === 'file' && (
             <span className="ml-auto flex items-center">
                {node.lifecycle === 'Replace' && <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded mr-2 border border-orange-200">Replace</span>}
                {node.status === 'valid' && <CheckCircle size={14} className="text-emerald-500" />}
             </span>
          )}
        </div>
        {node.type === 'folder' && node.isOpen && node.children && <div>{renderTree(node.children, level + 1)}</div>}
      </div>
    ));
  };

  return (
    <div className="flex h-full w-full bg-slate-50 overflow-hidden">
      {/* Left Pane: Tree */}
      <div className="w-1/3 max-w-sm bg-white border-r border-slate-200 flex flex-col h-full">
        <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xs font-bold uppercase text-slate-500 tracking-wider">v4.0 Dossier Structure</h2>
        </div>
        <div className="p-2 overflow-y-auto flex-1">{renderTree(treeData)}</div>
      </div>
      {/* Center Pane: Staging */}
      <div className="flex-1 flex flex-col bg-slate-50 h-full">
        <div className="p-4 border-b border-slate-200 bg-white shadow-sm z-10">
          <h2 className="text-lg font-semibold text-slate-800">Document Workspace</h2>
          <p className="text-sm text-slate-500">Map staged files to the Context of Use structure.</p>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-4 flex justify-between items-end">
            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Staging Area</h3>
            <button className="text-xs bg-white border border-slate-300 text-slate-600 px-2 py-1 rounded hover:bg-slate-50 flex items-center">
               <UploadCloud size={12} className="mr-1"/> Ingest PDFs
            </button>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {stagedFiles.map(file => (
              <div key={file.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md cursor-grab flex items-start group">
                <File className="text-red-400 mr-3 shrink-0 mt-0.5" size={24} />
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-slate-700 truncate">{file.name}</p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center"><LinkIcon size={10} className="mr-1"/> {file.id.split('-')[1]} • {file.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right Pane: Inspector */}
      <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-20">
        <div className="p-3 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Context of Use Inspector</h2>
        </div>
        {selectedNode ? (
          <div className="p-4 overflow-y-auto">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                {selectedNode.type === 'folder' ? <Folder className="text-blue-600" size={24} /> : <FileText className="text-blue-600" size={24} />}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-semibold text-slate-800 truncate" title={selectedNode.title}>{selectedNode.title}</h3>
                <p className="text-xs text-slate-500 capitalize">{selectedNode.type} Node</p>
              </div>
            </div>
            {selectedNode.type === 'file' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Lifecycle Operator</label>
                  <select className="w-full text-sm border border-slate-300 rounded-md p-2 bg-slate-50" value={selectedNode.lifecycle || 'Initial'} readOnly>
                    <option value="Initial">Initial (New)</option>
                    <option value="Replace">Replace (Update)</option>
                  </select>
                </div>
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase">Context of Use UUID</span>
                    <span className="block text-xs font-mono text-slate-700 bg-slate-100 p-1 rounded border border-slate-200">{selectedNode.id}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase">Document UUID</span>
                    <span className="block text-xs font-mono text-slate-700 bg-slate-100 p-1 rounded border border-slate-200">{selectedNode.docUuid}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-center text-slate-400"><p className="text-sm">Select a node to view metadata.</p></div>
        )}
      </div>
    </div>
  );
}

// --- COMPONENT 2: REGIONAL BUILDER ---
function RegionalBuilder() {
  return (
    <div className="p-6 overflow-y-auto h-full bg-slate-50 w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center mb-6">
          <Building size={24} className="mr-3 text-blue-600" />
          USFDA Regional Administrative Data
        </h1>
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm mb-6">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center border-b pb-2"><Hash size={18} className="mr-2 text-slate-500"/> Application Details</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Application Type & Number</label>
              <div className="flex space-x-2">
                <select className="w-1/3 text-sm border border-slate-300 rounded-md p-2 bg-slate-50"><option>NDA</option></select>
                <input type="text" value="214332" readOnly className="w-2/3 text-sm border border-slate-300 rounded-md p-2 bg-slate-50 font-mono" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Sequence Number</label>
              <input type="text" value="0002" readOnly className="w-full text-sm border border-slate-300 rounded-md p-2 bg-blue-50 text-blue-800 font-bold font-mono" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Sponsor Name</label>
              <input type="text" value="Acme Pharmaceuticals LLC" readOnly className="w-full text-sm border border-slate-300 rounded-md p-2 bg-slate-50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Submission Type</label>
              <select className="w-full text-sm border border-slate-300 rounded-md p-2 bg-slate-50"><option>Supplement</option></select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENT 3: VALIDATION DASHBOARD ---
function ValidationDashboard() {
  const results = [
    { id: 'ERR-V4-0012', sev: 'High', msg: 'Target ContextOfUse UUID for "Replace" not found.', node: 'Module 3.2.S.1' },
    { id: 'WARN-PDF-003', sev: 'Warning', msg: 'PDF contains non-embedded fonts.', node: 'batch_analysis_001.pdf' },
    { id: 'PASS-V4-0045', sev: 'Pass', msg: 'HL7 submissionunit.xml validates successfully.', node: 'Root Message' }
  ];

  return (
    <div className="p-6 h-full flex flex-col bg-slate-50 w-full">
      <div className="max-w-5xl mx-auto w-full flex flex-col h-full">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Sequence Validation Report</h1>
        <div className="grid grid-cols-3 gap-4 mb-6 shrink-0">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex justify-between items-center">
            <div><p className="text-sm font-semibold text-red-800 uppercase">Critical Errors</p><p className="text-3xl font-bold text-red-600">1</p></div>
            <XCircle size={32} className="text-red-300" />
          </div>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex justify-between items-center">
            <div><p className="text-sm font-semibold text-amber-800 uppercase">Warnings</p><p className="text-3xl font-bold text-amber-600">1</p></div>
            <AlertTriangle size={32} className="text-amber-300" />
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-lg flex justify-between items-center">
            <div><p className="text-sm font-semibold text-slate-500 uppercase">Status</p><p className="text-xl font-bold text-red-600 flex items-center"><XCircle size={18} className="mr-1"/> FAILED</p></div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex-1 overflow-hidden flex flex-col">
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                <tr><th className="p-4 w-24">Status</th><th className="p-4">Finding Description</th><th className="p-4 w-1/3">Location</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-4">
                      {r.sev === 'High' && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">ERROR</span>}
                      {r.sev === 'Warning' && <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded">WARN</span>}
                      {r.sev === 'Pass' && <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">PASS</span>}
                    </td>
                    <td className="p-4 font-medium text-slate-800">{r.msg}</td>
                    <td className="p-4 text-slate-600 flex items-center"><LayoutTree size={14} className="mr-2 text-slate-400"/> {r.node}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENT 4: AUDIT TRAIL ---
function AuditTrailDashboard() {
  const logs = [
    { id: 'AUD-0992', time: '2026-06-19T14:30:12Z', user: 'Dr. Sarah Jenkins', action: 'E-SIGNATURE APPLIED', target: 'Sequence 0002 Lock', type: 'critical' },
    { id: 'AUD-0991', time: '2026-06-19T14:28:05Z', user: 'System Process', action: 'VALIDATION RUN', target: 'Sequence 0002', type: 'system' },
    { id: 'AUD-0990', time: '2026-06-19T13:15:44Z', user: 'Michael Chen', action: 'METADATA UPDATE', target: 'tb_context_of_use', type: 'standard' }
  ];

  return (
    <div className="p-6 h-full flex flex-col bg-slate-50 w-full">
      <div className="max-w-5xl mx-auto w-full flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center"><ShieldCheck size={28} className="mr-3 text-emerald-600" /> Part 11 Audit Ledger</h1>
          <div className="bg-emerald-50 text-emerald-800 px-4 py-2 rounded-md flex items-center text-sm font-semibold border border-emerald-200"><Lock size={16} className="mr-2" /> Compliant</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex-1 overflow-hidden flex flex-col">
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                <tr><th className="p-4 w-48">Timestamp</th><th className="p-4 w-48">Operator</th><th className="p-4 w-48">Action</th><th className="p-4">Target</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-4 text-xs font-mono text-slate-500">{new Date(log.time).toLocaleString()}</td>
                    <td className="p-4 font-medium">{log.user}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${log.type==='critical'?'bg-purple-100 text-purple-700':log.type==='system'?'bg-slate-100 text-slate-600':'bg-blue-50 text-blue-700'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{log.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN APPLICATION SHELL ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dossier');

  return (
    <div className="flex h-screen w-full bg-slate-800 text-white overflow-hidden font-sans">
      
      {/* Global Sidebar Navigation */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shadow-xl z-50 shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold flex items-center text-blue-400">
            <Activity className="mr-2" /> Nexus eCTD
          </h1>
          <p className="text-xs text-slate-500 mt-1 tracking-widest uppercase">v4.0 Publishing Suite</p>
        </div>
        
        <div className="p-4 flex flex-col space-y-2 flex-1">
          <button 
            onClick={() => setActiveTab('dossier')}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all
            ${activeTab === 'dossier' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <LayoutTree size={18} className="mr-3" /> Dossier Builder
          </button>
          
          <button 
            onClick={() => setActiveTab('regional')}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all
            ${activeTab === 'regional' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <Building size={18} className="mr-3" /> USFDA Regional Data
          </button>
          
          <button 
            onClick={() => setActiveTab('validation')}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all
            ${activeTab === 'validation' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <AlertTriangle size={18} className="mr-3" /> Validation Engine
          </button>

          <button 
            onClick={() => setActiveTab('audit')}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all
            ${activeTab === 'audit' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <ShieldCheck size={18} className="mr-3" /> Part 11 Audit Trail
          </button>
        </div>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>App: NDA-214332</span>
          <span className="bg-slate-800 px-2 py-1 rounded text-slate-300">Seq 0002</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-40 text-slate-800">
          <div className="font-semibold capitalize text-lg">{activeTab.replace('-', ' ')}</div>
          <div className="flex space-x-3">
             <button className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-1.5 rounded-md font-medium transition flex items-center">
               <Settings size={16} className="mr-2"/> Configuration
             </button>
             <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md font-medium transition shadow flex items-center">
               <Download size={16} className="mr-2"/> Export Sequence
             </button>
          </div>
        </header>

        {/* Dynamic View Rendering */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'dossier' && <DossierBuilder />}
          {activeTab === 'regional' && <RegionalBuilder />}
          {activeTab === 'validation' && <ValidationDashboard />}
          {activeTab === 'audit' && <AuditTrailDashboard />}
        </div>
      </div>

    </div>
  );
}