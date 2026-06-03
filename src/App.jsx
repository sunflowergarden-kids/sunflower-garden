import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCIOesySZpgkiNVOToXWybPrE788_F6gBM",
  authDomain: "sunflower-garden-874ab.firebaseapp.com",
  projectId: "sunflower-garden-874ab",
  storageBucket: "sunflower-garden-874ab.firebasestorage.app",
  messagingSenderId: "990878187805",
  appId: "1:990878187805:web:c4de0a8dc9ea4a8c7b21f4"
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const LOGO_B64 = "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";
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbzPcbM47P497aNeAJnn9PVXpznm6KYySMOov4DJetaUc6ZWb954Wb_lMcKfQkH2-HRtqQ/exec";
const PAYMENT_URL = "https://pay.airwallex.com/hkhiv0ma33x5";

const DEFAULT_BG = [
  "linear-gradient(135deg,#B5E48C,#52B788)",
  "linear-gradient(135deg,#95D5B2,#40916C)",
  "linear-gradient(135deg,#FFE066,#A7C957)",
  "linear-gradient(135deg,#D8F3DC,#74C69D)",
  "linear-gradient(135deg,#FFD166,#83C96A)",
  "linear-gradient(135deg,#C7F9CC,#38A3A5)",
];

const categories = ["全部","手工藝術","感官遊戲","STEAM","語言文學","烹飪","音樂","Summer Camp"];

export default function App() {
  // Auth state
  const [user, setUser] = useState(null);
  const [authStep, setAuthStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmResult, setConfirmResult] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // App state
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedCat, setSelectedCat] = useState("全部");
  const [classes, setClasses] = useState([]);
  const [allDates, setAllDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ parent:"", child:"", phone2:"", age:"", notes:"" });
  const [bookings, setBookings] = useState([]);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [paymentPending, setPaymentPending] = useState(null);

  // Auth listener
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u);
        setAuthStep("done");
        await loadData();
        await loadBookings(u.uid);
      }
    });
    return () => unsub();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadSheet = (action) => new Promise((resolve, reject) => {
        const cb = "cb_" + Math.random().toString(36).slice(2);
        const script = document.createElement("script");
        let done = false;
        window[cb] = (data) => { if(done)return; done=true; resolve(data); delete window[cb]; script.remove(); };
        script.onerror = () => { if(done)return; done=true; reject(new Error("error")); delete window[cb]; script.remove(); };
        script.src = SHEETS_URL + "?action=" + action + "&callback=" + cb + "&t=" + Date.now();
        setTimeout(() => { if(!done){ done=true; reject(new Error("timeout")); delete window[cb]; script.remove(); }}, 8000);
        document.head.appendChild(script);
      });
      const [cData, dData] = await Promise.all([loadSheet("getCourses"), loadSheet("getDates")]);
      setClasses((Array.isArray(cData)?cData:[]).map((c,i) => ({...c, id:String(c.id), price:Number(c.price), totalSeats:Number(c.totalSeats), bg:c.bg||DEFAULT_BG[i%DEFAULT_BG.length]})));
      setAllDates((Array.isArray(dData)?dData:[]).map(d => ({...d, courseId:String(d.courseId), seats:Number(d.seats)})));
    } catch(e) {
      setError("無法載入課程資料，請稍後再試 🙏");
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async (uid) => {
    try {
      const q = query(collection(db, "bookings"), where("uid", "==", uid));
      const snap = await getDocs(q);
      setBookings(snap.docs.map(d => ({...d.data(), docId:d.id})));
    } catch(e) { console.log(e); }
  };

  const setupRecaptcha = () => {
    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } catch(e) {}
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "normal",
      callback: () => { console.log("reCAPTCHA solved"); },
      "expired-callback": () => { window.recaptchaVerifier = null; }
    });
  };

  const sendOTP = async () => {
    if (!phone || phone.length < 8) { setAuthError("請輸入正確電話號碼"); return; }
    setAuthLoading(true); setAuthError("");
    try {
      setupRecaptcha();
      await window.recaptchaVerifier.render();
      const fullPhone = phone.startsWith("+") ? phone : "+852" + phone;
      const result = await signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier);
      setConfirmResult(result);
      setAuthStep("otp");
    } catch(e) {
      console.log("SMS error:", e.code, e.message);
      if (e.code === "auth/operation-not-allowed") {
        setAuthError("請確認 Firebase 已開啟電話登入功能");
      } else if (e.code === "auth/too-many-requests") {
        setAuthError("請求次數過多，請稍後再試");
      } else if (e.code === "auth/invalid-phone-number") {
        setAuthError("電話號碼格式不正確");
      } else {
        setAuthError("發送驗證碼失敗：" + e.code);
      }
    }
    setAuthLoading(false);
  };

  const verifyOTP = async () => {
    if (!otp || otp.length < 6) { setAuthError("請輸入6位驗證碼"); return; }
    setAuthLoading(true); setAuthError("");
    try {
      const result = await confirmResult.confirm(otp);
      setUser(result.user);
      setAuthStep("done");
      await loadData();
      await loadBookings(result.user.uid);
    } catch(e) { setAuthError("驗證碼錯誤，請重試"); }
    setAuthLoading(false);
  };

  const getDatesForClass = (id) => allDates.filter(d => String(d.courseId) === String(id));
  const filtered = classes.filter(c => selectedCat === "全部" || c.category === selectedCat);
  const getKey = (classId, date) => classId + "_" + date;
  const isBooked = (classId, date) => bookings.some(b => b.key === getKey(classId, date));
  const totalSpend = bookings.reduce((s,b) => s + b.price, 0);

  const openClass = (cls) => { setSelectedClass(cls); setSelectedDate(null); setShowModal(false); };
  const openBooking = (d) => { setSelectedDate(d); setForm({ parent:"", child:"", phone2:"", age:"", notes:"" }); setShowModal(true); };

  const confirm = async () => {
    if (!form.parent || !form.child || !form.phone2) return;
    setSubmitting(true);
    const newBooking = {
      id: Date.now(),
      key: getKey(selectedClass.id, selectedDate.date),
      classId: selectedClass.id,
      className: selectedClass.name,
      emoji: selectedClass.emoji,
      bg: selectedClass.bg,
      category: selectedClass.category,
      teacher: selectedClass.teacher,
      time: selectedClass.time,
      price: selectedClass.price,
      date: selectedDate.date,
      day: selectedDate.day,
      parent: form.parent,
      child: form.child,
      phone: form.phone2,
      age: form.age,
      notes: form.notes,
      uid: user ? user.uid : "guest",
    };
    setPaymentPending(newBooking);
    setSubmitting(false);
    setShowModal(false);
    window.open(PAYMENT_URL, "_blank");
  };

  const confirmPayment = async () => {
    if (!paymentPending) return;
    try {
      const docRef = await addDoc(collection(db, "bookings"), {...paymentPending, confirmedAt: new Date().toISOString()});
      await fetch(SHEETS_URL, { method:"POST", body: JSON.stringify({action:"addBooking", ...paymentPending}) }).catch(e => {});
      setBookings(p => [...p, {...paymentPending, docId:docRef.id}]);
    } catch(e) { console.log(e); }
    const t = paymentPending;
    setPaymentPending(null);
    setToast({ name:t.className, date:t.date, price:t.price });
    setTimeout(() => setToast(null), 3500);
  };

  const cancelBooking = async (key, id, docId) => {
    try {
      if (docId) await deleteDoc(doc(db, "bookings", docId));
      await fetch(SHEETS_URL, { method:"POST", body: JSON.stringify({action:"cancelBooking", id}) }).catch(e => {});
    } catch(e) {}
    setBookings(p => p.filter(b => b.key !== key));
  };

  const seatColor = (s) => s===0?"#bbb":s<=2?"#E8855B":"#2D8A5E";
  const seatLabel = (s) => s===0?"已滿額 🈵":s<=2?"🔥 剩 "+s+" 位":"✅ 尚餘 "+s+" 位";

  // ── AUTH SCREEN ──
  if (authStep !== "done") {
    return (
      <div style={{ fontFamily:"'Nunito','PingFang HK',sans-serif", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", background:"linear-gradient(160deg,#F0FAF2,#E0F5E8)" }}>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Baloo+2:wght@700;800&display=swap" rel="stylesheet" />
        <div id="recaptcha-container" style={{ margin:"16px auto", display:"flex", justifyContent:"center" }}></div>
        <div style={{ width:90, height:90, borderRadius:"50%", overflow:"hidden", marginBottom:20, boxShadow:"0 6px 24px rgba(45,138,94,0.3)" }}>
          <img src={"data:image/png;base64," + LOGO_B64} alt="logo" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
        <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:26, fontWeight:800, color:"#2D8A5E", marginBottom:4 }}>Sunflower Garden</div>
        <div style={{ fontSize:13, fontWeight:700, color:"#7ABF9A", marginBottom:32 }}>🌈 向日葵花園親子課程</div>
        <div style={{ width:"100%", maxWidth:360, background:"#fff", borderRadius:24, padding:"28px 24px", boxShadow:"0 8px 32px rgba(45,138,94,0.15)" }}>
          {authStep === "phone" && (
            <div>
              <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:18, fontWeight:800, color:"#2D8A5E", marginBottom:6 }}>📱 家長登入</div>
              <div style={{ fontSize:13, fontWeight:600, color:"#888", marginBottom:20 }}>輸入手機號碼，我們將發送驗證碼</div>
              <label style={{ fontSize:11, fontWeight:900, color:"#2D8A5E", textTransform:"uppercase", letterSpacing:0.8 }}>香港手機號碼</label>
              <div style={{ display:"flex", gap:8, marginTop:6, marginBottom:16 }}>
                <div style={{ background:"#F0FAF2", borderRadius:12, padding:"12px 14px", fontSize:14, fontWeight:800, color:"#2D8A5E", flexShrink:0 }}>🇭🇰 +852</div>
                <input type="tel" placeholder="9123 4567" value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9]/g,""))} maxLength={8}
                  style={{ flex:1, padding:"12px 14px", borderRadius:12, border:phone.length===8?"2.5px solid #52B788":"2.5px solid #C8EDD8", fontSize:15, fontWeight:700, color:"#1B4D32", background:"#fff", fontFamily:"inherit" }} />
              </div>
              {authError && <div style={{ color:"#E8855B", fontSize:12, fontWeight:700, marginBottom:10 }}>{authError}</div>}
              <button onClick={sendOTP} disabled={phone.length<8||authLoading} style={{ width:"100%", padding:"14px", borderRadius:16, border:"none", background:phone.length<8?"#C8EDD8":"linear-gradient(135deg,#52B788,#2D8A5E)", color:"#fff", fontWeight:900, fontSize:15, cursor:"pointer", fontFamily:"'Baloo 2',cursive" }}>
                {authLoading?"發送中...":"發送驗證碼 📲"}
              </button>
            </div>
          )}
          {authStep === "otp" && (
            <div>
              <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:18, fontWeight:800, color:"#2D8A5E", marginBottom:6 }}>🔐 輸入驗證碼</div>
              <div style={{ fontSize:13, fontWeight:600, color:"#888", marginBottom:20 }}>已發送至 +852 {phone}</div>
              <input type="number" placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6}
                style={{ width:"100%", padding:"14px", borderRadius:12, border:otp.length===6?"2.5px solid #52B788":"2.5px solid #C8EDD8", fontSize:20, fontWeight:800, color:"#1B4D32", background:"#fff", textAlign:"center", marginBottom:16, boxSizing:"border-box", fontFamily:"inherit" }} />
              {authError && <div style={{ color:"#E8855B", fontSize:12, fontWeight:700, marginBottom:10 }}>{authError}</div>}
              <button onClick={verifyOTP} disabled={otp.length<6||authLoading} style={{ width:"100%", padding:"14px", borderRadius:16, border:"none", background:otp.length<6?"#C8EDD8":"linear-gradient(135deg,#52B788,#2D8A5E)", color:"#fff", fontWeight:900, fontSize:15, cursor:"pointer", fontFamily:"'Baloo 2',cursive" }}>
                {authLoading?"驗證中...":"確認登入 ✅"}
              </button>
              <button onClick={() => { setAuthStep("phone"); setOtp(""); setAuthError(""); }} style={{ width:"100%", marginTop:10, padding:"10px", borderRadius:12, border:"none", background:"none", color:"#AAD4BC", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>重新發送驗證碼</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── MAIN APP ──
  return (
    <div style={{ fontFamily:"'Nunito','PingFang HK',sans-serif", background:"#F0FAF2", minHeight:"100vh", maxWidth:430, margin:"0 auto", position:"relative", overflowX:"hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Baloo+2:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideRight { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes toastIn { 0%{transform:translateX(-50%) translateY(80px);opacity:0} 12%{opacity:1;transform:translateX(-50%) translateY(0)} 85%{opacity:1;transform:translateX(-50%) translateY(0)} 100%{opacity:0;transform:translateX(-50%) translateY(80px)} }
        @keyframes sunPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.07)} }
        .card { animation:fadeUp 0.35s ease forwards; opacity:0; }
        .card:hover { transform:translateY(-3px); box-shadow:0 14px 36px rgba(40,140,80,0.16) !important; transition:transform 0.2s,box-shadow 0.2s; }
        .date-card { animation:fadeUp 0.35s ease forwards; opacity:0; transition:all 0.18s ease; }
        .date-card:hover { transform:translateY(-2px); }
        .bookbtn { transition:all 0.18s ease; }
        .bookbtn:hover { filter:brightness(1.07); transform:translateY(-1px); }
        .bookbtn:active { transform:scale(0.96); }
        .chip { transition:all 0.15s ease; cursor:pointer; }
        .chip:active { transform:scale(0.92); }
        .modal-sheet { animation:slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1); }
        .modal-bg { animation:fadeUp 0.2s ease; }
        .sun-pulse { animation:sunPulse 2.8s ease-in-out infinite; }
        .float { animation:float 3s ease-in-out infinite; }
        .toast { animation:toastIn 3.5s ease forwards; }
        .slide-in { animation:slideRight 0.3s ease forwards; }
        .spinner { animation:spin 0.8s linear infinite; }
        input,textarea { font-family:inherit; }
        input:focus,textarea:focus { outline:none; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#74C69D;border-radius:8px}
      `}</style>

      {["🌻","🍃","🌿","🐝","🍀","✨","🌸"].map((it,i) => (
        <div key={i} style={{ position:"fixed", pointerEvents:"none", zIndex:0, fontSize:14+(i%3)*4, top:(8+i*12)+"%", left:i%2===0?(1+i*2)+"%":"auto", right:i%2!==0?(2+i*2)+"%":"auto", opacity:0.11, animation:"float "+(2.8+i*0.3)+"s ease-in-out infinite", animationDelay:(i*0.4)+"s" }}>{it}</div>
      ))}

      {/* HEADER */}
      <div style={{ background:"linear-gradient(145deg,#52B788,#2D8A5E,#1B5E42)", padding:"24px 20px 28px", borderRadius:"0 0 32px 32px", boxShadow:"0 8px 32px rgba(29,110,70,0.38)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-50, right:-30, width:170, height:170, borderRadius:"50%", background:"rgba(255,255,255,0.09)" }} />
        <div style={{ position:"relative", display:"flex", alignItems:"center", gap:14 }}>
          <div className="sun-pulse" style={{ width:66, height:66, borderRadius:"50%", overflow:"hidden", flexShrink:0, boxShadow:"0 6px 20px rgba(0,0,0,0.2)", background:"transparent" }}>
            <img src={"data:image/png;base64,"+LOGO_B64} alt="Sunflower Garden" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
          <div>
            <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:20, padding:"2px 12px", display:"inline-block", marginBottom:4 }}>
              <span style={{ fontSize:10, fontWeight:900, color:"rgba(255,255,255,0.9)", letterSpacing:1.5, textTransform:"uppercase" }}>歡迎來到</span>
            </div>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:25, fontWeight:800, color:"#fff", lineHeight:1.15 }}>Sunflower Garden</div>
            <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.8)", marginTop:2 }}>🌈 向日葵花園親子課程</div>
          </div>
          <div style={{ marginLeft:"auto" }}>
            <div onClick={() => setActiveTab("bookings")} style={{ background:"rgba(255,255,255,0.2)", borderRadius:16, padding:"10px 12px", cursor:"pointer", textAlign:"center", border:"1.5px solid rgba(255,255,255,0.35)" }}>
              <div style={{ fontSize:20 }}>📋</div>
              <div style={{ fontSize:10, fontWeight:900, color:"#FFE566", marginTop:2 }}>{bookings.length} 預約</div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display:"flex", gap:8, padding:"12px 14px 0", position:"sticky", top:0, zIndex:10, background:"#F0FAF2" }}>
        {[{key:"browse",icon:"🔍",label:"課程"},{key:"summer",icon:"☀️",label:"暑期班"},{key:"bookings",icon:"🌟",label:"預約"}].map(t => (
          <button key={t.key} onClick={() => { setActiveTab(t.key); setSelectedClass(null); if(t.key==="summer") setSelectedCat("Summer Camp"); else if(t.key==="browse") setSelectedCat("全部"); }} style={{ flex:1, padding:"10px 6px", border:"none", borderRadius:20, background:activeTab===t.key?t.key==="summer"?"linear-gradient(135deg,#FFD166,#FF9500)":"linear-gradient(135deg,#52B788,#2D8A5E)":"#fff", color:activeTab===t.key?"#fff":"#A0C8B0", fontWeight:900, fontSize:12, cursor:"pointer", fontFamily:"inherit", boxShadow:activeTab===t.key?t.key==="summer"?"0 4px 16px rgba(255,150,0,0.38)":"0 4px 16px rgba(45,138,94,0.38)":"0 2px 8px rgba(0,0,0,0.06)", outline:"none", transition:"all 0.2s" }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {/* PAYMENT PENDING BANNER */}
      {paymentPending && (
        <div style={{ margin:"12px 14px 0", background:"linear-gradient(135deg,#FFF8E0,#FFF0C0)", borderRadius:20, padding:"16px", border:"2px solid #FFD066" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <span style={{ fontSize:28 }}>💳</span>
            <div>
              <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, color:"#CC8800", fontSize:15 }}>等待付款確認</div>
              <div style={{ fontSize:12, fontWeight:700, color:"#AA7700" }}>{paymentPending.className} · {paymentPending.date} · HK${paymentPending.price}</div>
            </div>
          </div>
          <div style={{ fontSize:12, fontWeight:700, color:"#AA7700", marginBottom:12 }}>請完成付款後，點擊下方按鈕確認預約 👇</div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => window.open(PAYMENT_URL,"_blank")} style={{ flex:1, padding:"11px", borderRadius:14, border:"2px solid #FFD066", background:"#fff", color:"#CC8800", fontWeight:900, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>重新付款 💳</button>
            <button onClick={confirmPayment} style={{ flex:2, padding:"11px", borderRadius:14, border:"none", background:"linear-gradient(135deg,#FFD166,#FF9500)", color:"#fff", fontWeight:900, fontSize:13, cursor:"pointer", fontFamily:"'Baloo 2',cursive" }}>✅ 我已付款，確認預約！</button>
          </div>
          <button onClick={() => setPaymentPending(null)} style={{ width:"100%", marginTop:8, padding:"8px", borderRadius:12, border:"none", background:"none", color:"#ccc", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>取消此預約</button>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div style={{ textAlign:"center", padding:"80px 20px" }}>
          <div className="spinner" style={{ width:48, height:48, border:"4px solid #C8EDD8", borderTop:"4px solid #2D8A5E", borderRadius:"50%", margin:"0 auto 16px" }} />
          <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:16, fontWeight:800, color:"#52B788" }}>載入課程中...</div>
        </div>
      )}

      {/* ERROR */}
      {error && !loading && (
        <div style={{ margin:"20px 14px", background:"#FFF0F0", borderRadius:16, padding:"16px", border:"1.5px solid #FFB3B3", textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:8 }}>😔</div>
          <div style={{ fontWeight:800, color:"#CC4444", fontSize:14 }}>{error}</div>
          <button onClick={loadData} style={{ marginTop:12, background:"linear-gradient(135deg,#52B788,#2D8A5E)", color:"#fff", border:"none", borderRadius:12, padding:"8px 20px", fontWeight:900, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>重新載入</button>
        </div>
      )}

      {/* BROWSE - Class List */}
      {!loading && !error && (activeTab === "browse" || activeTab === "summer") && !selectedClass && (
        <div style={{ padding:"12px 14px 110px" }}>
          {activeTab === "summer" && (
            <div style={{ background:"linear-gradient(135deg,#FFD166,#FF9500)", borderRadius:18, padding:"14px 16px", marginBottom:14, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-15, right:-15, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.2)" }} />
              <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:18, fontWeight:800, color:"#fff", marginBottom:2 }}>☀️ Summer Camp 2025</div>
              <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.9)" }}>📍 荔枝角 · 7 JUL – 28 AUG · 10:30-12:30</div>
              <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.85)", marginTop:3 }}>適合升PN-升K2幼兒 · 每堂 HK$350</div>
            </div>
          )}
          {activeTab !== "summer" && (
            <div style={{ overflowX:"auto", paddingBottom:8, marginBottom:14 }}>
              <div style={{ display:"flex", gap:8, width:"max-content" }}>
                {categories.filter(c => c !== "Summer Camp").map(cat => (
                  <button key={cat} className="chip" onClick={() => setSelectedCat(cat)} style={{ padding:"7px 14px", borderRadius:20, border:selectedCat===cat?"none":"2.5px solid #D4F0C0", background:selectedCat===cat?"linear-gradient(135deg,#52B788,#2D8A5E)":"#fff", color:selectedCat===cat?"#fff":"#52A878", fontSize:12, fontWeight:900, cursor:"pointer", fontFamily:"inherit", boxShadow:selectedCat===cat?"0 3px 10px rgba(45,138,94,0.35)":"none" }}>{cat}</button>
                ))}
              </div>
            </div>
          )}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {filtered.map((cls,i) => (
              <div key={cls.id} className="card" onClick={() => openClass(cls)} style={{ borderRadius:22, overflow:"hidden", boxShadow:"0 4px 20px rgba(0,0,0,0.08)", animationDelay:(i*0.06)+"s", background:"#fff", cursor:"pointer" }}>
                <div style={{ background:cls.bg, padding:"14px 16px", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:-15, right:-15, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.18)" }} />
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:50, height:50, borderRadius:16, background:"rgba(255,255,255,0.45)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{cls.emoji}</div>
                      <div>
                        <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:17, fontWeight:800, color:"#fff", textShadow:"0 1px 4px rgba(0,0,0,0.18)" }}>{cls.name}</div>
                        <div style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.92)", background:"rgba(0,0,0,0.18)", borderRadius:10, padding:"2px 8px", display:"inline-block", marginTop:2 }}>{cls.category} · {cls.age}</div>
                      </div>
                    </div>
                    <div style={{ fontSize:26 }}>{cls.sticker}</div>
                  </div>
                </div>
                <div style={{ padding:"12px 16px 14px" }}>
                  <p style={{ color:"#777", fontSize:13, lineHeight:1.5, margin:"0 0 10px", fontWeight:600 }}>{cls.desc}</p>
                  <div style={{ background:"linear-gradient(135deg,#F0FAF2,#E0F5E8)", borderRadius:14, padding:"10px 14px", border:"1.5px solid #C8EDD8", display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                    <div>
                      <div style={{ fontSize:10, fontWeight:900, color:"#7ABF9A", textTransform:"uppercase", letterSpacing:0.5 }}>每堂收費</div>
                      <div style={{ fontSize:22, fontWeight:900, color:"#2D8A5E" }}>HK${cls.price}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:11, fontWeight:800, color:"#52A878" }}>⏰ {cls.time}</div>
                      <div style={{ fontSize:11, fontWeight:800, color:"#52A878", marginTop:2 }}>📅 {getDatesForClass(cls.id).length} 個日期</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", justifyContent:"flex-end" }}>
                    <div style={{ background:"linear-gradient(135deg,#52B788,#2D8A5E)", borderRadius:12, padding:"6px 16px", fontSize:12, fontWeight:900, color:"#fff" }}>查看日期 →</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BROWSE - Class Detail */}
      {!loading && !error && (activeTab === "browse" || activeTab === "summer") && selectedClass && (
        <div className="slide-in" style={{ padding:"12px 14px 110px" }}>
          <button onClick={() => setSelectedClass(null)} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#2D8A5E", fontWeight:900, fontSize:13, cursor:"pointer", padding:"4px 0 12px", fontFamily:"inherit" }}>← 返回課程列表</button>
          <div style={{ borderRadius:22, overflow:"hidden", marginBottom:14, boxShadow:"0 6px 24px rgba(45,138,94,0.18)" }}>
            <div style={{ background:selectedClass.bg, padding:"16px 18px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.18)" }} />
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:54, height:54, borderRadius:18, background:"rgba(255,255,255,0.45)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>{selectedClass.emoji}</div>
                <div>
                  <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:19, fontWeight:800, color:"#fff" }}>{selectedClass.name}</div>
                  <div style={{ fontSize:12, fontWeight:800, color:"rgba(255,255,255,0.88)" }}>{selectedClass.category} · {selectedClass.teacher} · {selectedClass.age}</div>
                </div>
                <div style={{ marginLeft:"auto", fontSize:32 }}>{selectedClass.sticker}</div>
              </div>
              <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
                {[{i:"⏰",t:selectedClass.time},{i:"⏱",t:selectedClass.duration},{i:"🪑",t:"每堂 "+selectedClass.totalSeats+" 個座位"}].map(p => (
                  <span key={p.t} style={{ background:"rgba(255,255,255,0.42)", borderRadius:10, padding:"2px 9px", fontSize:11, fontWeight:800, color:"rgba(0,0,0,0.65)" }}>{p.i} {p.t}</span>
                ))}
              </div>
            </div>
            <div style={{ background:"#fff", padding:"12px 16px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <p style={{ color:"#777", fontSize:13, lineHeight:1.5, margin:0, fontWeight:600, flex:1 }}>{selectedClass.desc}</p>
              <div style={{ marginLeft:14, background:"linear-gradient(135deg,#F0FAF2,#E0F5E8)", borderRadius:14, padding:"8px 14px", border:"1.5px solid #C8EDD8", textAlign:"center", flexShrink:0 }}>
                <div style={{ fontSize:10, fontWeight:900, color:"#7ABF9A", textTransform:"uppercase" }}>每堂收費</div>
                <div style={{ fontSize:20, fontWeight:900, color:"#2D8A5E" }}>HK${selectedClass.price}</div>
              </div>
            </div>
          </div>
          <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:15, fontWeight:800, color:"#2D8A5E", marginBottom:10 }}>📅 選擇上課日期</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {getDatesForClass(selectedClass.id).map((d,i) => {
              const booked = isBooked(selectedClass.id, d.date);
              const full = d.seats === 0;
              const pct = ((selectedClass.totalSeats - d.seats) / selectedClass.totalSeats) * 100;
              return (
                <div key={d.date} className="date-card" style={{ background:"#fff", borderRadius:18, padding:"12px 14px", boxShadow:"0 3px 14px rgba(0,0,0,0.07)", border:booked?"2.5px solid #52B788":full?"2.5px solid #eee":"2.5px solid #E8F5EE", animationDelay:(i*0.07)+"s" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:48, height:48, borderRadius:14, background:booked?"linear-gradient(135deg,#B5E48C,#52B788)":full?"#f0f0f0":selectedClass.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:13, fontWeight:900, color:booked||!full?"#fff":"#ccc" }}>{d.date}</div>
                      </div>
                      <div>
                        <div style={{ fontWeight:900, fontSize:14, color:full&&!booked?"#bbb":"#1B4D32" }}>{d.date} ({d.day})</div>
                        <div style={{ fontSize:12, fontWeight:700, color:seatColor(d.seats), marginTop:1 }}>{booked?"✅ 已預約":seatLabel(d.seats)}</div>
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      {!booked && !full && (
                        <div>
                          <div style={{ fontSize:13, fontWeight:900, color:"#2D8A5E", marginBottom:5 }}>HK${selectedClass.price}</div>
                          <button className="bookbtn" onClick={() => openBooking(d)} style={{ background:"linear-gradient(135deg,#52B788,#2D8A5E)", color:"#fff", border:"none", borderRadius:12, padding:"7px 14px", fontWeight:900, fontSize:12, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 3px 10px rgba(45,138,94,0.35)", whiteSpace:"nowrap" }}>立即預約</button>
                        </div>
                      )}
                      {booked && <div style={{ background:"linear-gradient(135deg,#B5E48C,#52B788)", borderRadius:12, padding:"7px 12px" }}><div style={{ fontSize:11, fontWeight:900, color:"#fff" }}>✓ 已預約</div></div>}
                      {full && !booked && <div style={{ background:"#f0f0f0", borderRadius:12, padding:"7px 12px" }}><div style={{ fontSize:11, fontWeight:900, color:"#bbb" }}>🈵 已滿</div></div>}
                    </div>
                  </div>
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:10, fontWeight:800, color:"#ccc" }}>座位情況</span>
                      <span style={{ fontSize:11, fontWeight:900, color:seatColor(d.seats) }}>{d.seats}/{selectedClass.totalSeats} 位可預約</span>
                    </div>
                    <div style={{ height:7, background:"#EEF5EE", borderRadius:20, overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:20, width:pct+"%", background:d.seats===0?"#ddd":d.seats<=2?"linear-gradient(90deg,#FFD166,#E8855B)":selectedClass.bg }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* BOOKINGS TAB */}
      {activeTab === "bookings" && (
        <div style={{ padding:"16px 14px 110px" }}>
          {bookings.length === 0 ? (
            <div style={{ textAlign:"center", padding:"56px 20px" }}>
              <div className="float" style={{ fontSize:72, marginBottom:14 }}>🌱</div>
              <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:20, fontWeight:800, color:"#52B788", marginBottom:8 }}>尚未有預約紀錄</div>
              <div style={{ color:"#AAD4BC", fontSize:13, fontWeight:600, marginBottom:22 }}>快去為小朋友選擇課程吧 🌈</div>
              <button onClick={() => setActiveTab("browse")} className="bookbtn" style={{ background:"linear-gradient(135deg,#52B788,#2D8A5E)", color:"#fff", border:"none", borderRadius:20, padding:"13px 28px", fontWeight:900, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>瀏覽課程 🔍</button>
            </div>
          ) : (
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:20, fontWeight:800, color:"#2D8A5E" }}>我的預約 🌟</div>
                <div style={{ background:"linear-gradient(135deg,#52B788,#2D8A5E)", borderRadius:20, padding:"2px 12px", fontSize:13, fontWeight:900, color:"#fff" }}>{bookings.length}</div>
              </div>
              <div style={{ background:"linear-gradient(135deg,#52B788,#2D8A5E)", borderRadius:18, padding:"14px 18px", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 4px 18px rgba(45,138,94,0.35)" }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:900, color:"rgba(255,255,255,0.75)", textTransform:"uppercase", letterSpacing:1 }}>總費用</div>
                  <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:26, fontWeight:800, color:"#fff", marginTop:2 }}>HK${totalSpend}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:11, fontWeight:900, color:"rgba(255,255,255,0.75)" }}>{bookings.length} 個課堂</div>
                  <div style={{ fontSize:13, fontWeight:900, color:"#FFE566", marginTop:4 }}>🌻 感謝支持！</div>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {bookings.map((b,i) => (
                  <div key={b.id||i} className="card" style={{ borderRadius:20, overflow:"hidden", boxShadow:"0 4px 18px rgba(45,138,94,0.1)", animationDelay:(i*0.06)+"s", border:"2px solid #C8EDD8", background:"#fff" }}>
                    <div style={{ background:b.bg, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:42, height:42, borderRadius:14, background:"rgba(255,255,255,0.4)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{b.emoji}</div>
                      <div>
                        <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:15, fontWeight:800, color:"#fff" }}>{b.className}</div>
                        <div style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.85)" }}>{b.category} · {b.teacher}</div>
                      </div>
                      <div style={{ marginLeft:"auto", background:"rgba(255,255,255,0.3)", borderRadius:10, padding:"6px 12px", textAlign:"center" }}>
                        <div style={{ fontSize:16, fontWeight:900, color:"#fff" }}>HK${b.price}</div>
                        <div style={{ fontSize:9, fontWeight:900, color:"rgba(255,255,255,0.8)" }}>每堂收費</div>
                      </div>
                    </div>
                    <div style={{ padding:"12px 16px 14px" }}>
                      <div style={{ background:"#F0FAF2", borderRadius:14, padding:"10px 12px", marginBottom:10, border:"1.5px solid #C8EDD8" }}>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 14px" }}>
                          {[{label:"👩 家長",val:b.parent},{label:"📱 電話",val:b.phone},{label:"🧒 小朋友",val:b.child},{label:"📅 日期",val:b.date+" ("+b.day+")"},{label:"⏰ 時間",val:b.time}].map(row => (
                            <div key={row.label}>
                              <div style={{ fontSize:10, fontWeight:900, color:"#7ABF9A", textTransform:"uppercase", letterSpacing:0.5 }}>{row.label}</div>
                              <div style={{ fontSize:13, fontWeight:800, color:"#1B4D32", marginTop:1 }}>{row.val}</div>
                            </div>
                          ))}
                        </div>
                        {b.notes && <div style={{ marginTop:8, paddingTop:8, borderTop:"1.5px dashed #C8EDD8" }}><div style={{ fontSize:10, fontWeight:900, color:"#7ABF9A" }}>📝 備注</div><div style={{ fontSize:12, fontWeight:700, color:"#555", marginTop:2 }}>{b.notes}</div></div>}
                      </div>
                      <button onClick={() => cancelBooking(b.key, b.id, b.docId)} style={{ width:"100%", padding:"10px", borderRadius:14, border:"2px dashed #C8EDD8", background:"#F5FFFA", color:"#999", fontWeight:900, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>取消預約 🍃</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"rgba(240,250,242,0.97)", backdropFilter:"blur(16px)", borderTop:"2px solid #C8EDD8", padding:"10px 32px 22px", display:"flex", justifyContent:"space-around" }}>
        {[{key:"browse",icon:"🌿",label:"課程"},{key:"bookings",icon:"⭐",label:"預約"}].map(t => (
          <button key={t.key} onClick={() => { setActiveTab(t.key); if(t.key==="browse") setSelectedClass(null); }} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, border:"none", background:"none", cursor:"pointer", fontFamily:"inherit" }}>
            <div style={{ width:48, height:48, borderRadius:16, background:activeTab===t.key?"linear-gradient(135deg,#52B788,#2D8A5E)":"#E8F5EE", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, transition:"all 0.2s", boxShadow:activeTab===t.key?"0 4px 16px rgba(45,138,94,0.42)":"none", transform:activeTab===t.key?"scale(1.1)":"scale(1)" }}>{t.icon}</div>
            <span style={{ fontSize:11, fontWeight:900, color:activeTab===t.key?"#2D8A5E":"#B0CFC0" }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TOAST */}
      {toast && (
        <div className="toast" style={{ position:"fixed", bottom:90, left:"50%", background:"linear-gradient(135deg,#52B788,#2D8A5E)", borderRadius:22, padding:"13px 20px", display:"flex", alignItems:"center", gap:10, boxShadow:"0 8px 28px rgba(45,138,94,0.45)", zIndex:999, border:"3px solid #fff", minWidth:270 }}>
          <span style={{ fontSize:26 }}>🎉</span>
          <div>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, color:"#fff", fontSize:14 }}>預約成功！</div>
            <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.88)" }}>{toast.name} {toast.date} · HK${toast.price} 🌻</div>
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {showModal && selectedClass && selectedDate && (
        <div className="modal-bg" onClick={() => setShowModal(false)} style={{ position:"fixed", inset:0, background:"rgba(10,50,30,0.5)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:200, backdropFilter:"blur(6px)" }}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ background:"#F0FAF2", borderRadius:"26px 26px 0 0", width:"100%", maxWidth:430, padding:"18px 20px 36px", maxHeight:"92vh", overflowY:"auto" }}>
            <div style={{ width:44, height:5, background:"#74C69D", borderRadius:10, margin:"0 auto 16px" }} />
            <div style={{ background:selectedClass.bg, borderRadius:18, padding:"12px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:12, position:"relative", overflow:"hidden" }}>
              <div style={{ width:46, height:46, borderRadius:14, background:"rgba(255,255,255,0.42)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{selectedClass.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:16, fontWeight:800, color:"#fff" }}>{selectedClass.name}</div>
                <div style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.88)" }}>📅 {selectedDate.date} ({selectedDate.day}) · ⏰ {selectedClass.time}</div>
                <div style={{ fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.88)", marginTop:1 }}>🪑 尚餘 {selectedDate.seats} 個座位</div>
              </div>
              <div style={{ background:"rgba(255,255,255,0.35)", borderRadius:12, padding:"8px 12px", textAlign:"center", flexShrink:0 }}>
                <div style={{ fontSize:18, fontWeight:900, color:"#fff" }}>HK${selectedClass.price}</div>
                <div style={{ fontSize:9, fontWeight:900, color:"rgba(255,255,255,0.85)" }}>每堂收費</div>
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[{label:"👩 家長／監護人姓名",key:"parent",ph:"例如：陳美玲",req:true},{label:"🧒 小朋友姓名",key:"child",ph:"例如：陳小明",req:true},{label:"📱 聯絡電話",key:"phone2",ph:"例如：9123 4567",req:true},{label:"🎂 小朋友年齡",key:"age",ph:"例如：4歲",req:false}].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize:11, fontWeight:900, color:"#2D8A5E", display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.8 }}>{f.label}{f.req?" *":""}</label>
                  <input type={f.key==="phone2"?"tel":"text"} placeholder={f.ph} value={form[f.key]} onChange={e => setForm(p => ({...p,[f.key]:e.target.value}))} style={{ width:"100%", padding:"12px 14px", borderRadius:14, border:form[f.key]?"2.5px solid #52B788":"2.5px solid #C8EDD8", fontSize:14, fontWeight:700, color:"#1B4D32", background:"#fff", boxSizing:"border-box" }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize:11, fontWeight:900, color:"#2D8A5E", display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.8 }}>📝 特別備注／過敏事項</label>
                <textarea placeholder="如有特殊需要或過敏情況，請在此說明..." value={form.notes} onChange={e => setForm(p => ({...p,notes:e.target.value}))} rows={2} style={{ width:"100%", padding:"12px 14px", borderRadius:14, border:"2.5px solid #C8EDD8", fontSize:13, fontWeight:700, color:"#1B4D32", background:"#fff", resize:"none", boxSizing:"border-box" }} />
              </div>
            </div>
            <div style={{ background:"linear-gradient(135deg,#FFF8E0,#FFF0C0)", borderRadius:14, padding:"12px 14px", marginTop:14, border:"1.5px solid #FFE08A", display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:22 }}>💳</span>
              <div>
                <div style={{ fontSize:12, fontWeight:900, color:"#CC8800" }}>點擊確認後將跳至付款頁面</div>
                <div style={{ fontSize:11, fontWeight:700, color:"#AA7700", marginTop:2 }}>付款完成後記得點「我已付款」✅</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:12 }}>
              <button onClick={() => setShowModal(false)} style={{ flex:1, padding:"13px", borderRadius:16, border:"2.5px solid #C8EDD8", background:"#fff", color:"#B0C8BC", fontWeight:900, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>取消</button>
              <button onClick={confirm} disabled={!form.parent||!form.child||!form.phone2||submitting} className="bookbtn" style={{ flex:2, padding:"13px", borderRadius:16, border:"none", background:(!form.parent||!form.child||!form.phone2||submitting)?"#C8EDD8":"linear-gradient(135deg,#52B788,#2D8A5E)", color:(!form.parent||!form.child||!form.phone2||submitting)?"#90C0A0":"#fff", fontWeight:900, fontSize:14, cursor:"pointer", fontFamily:"'Baloo 2',cursive" }}>
                {submitting?"跳轉付款中...":"下一步：付款 HK$"+selectedClass.price+" 💳"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
