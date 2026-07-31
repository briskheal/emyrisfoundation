'use client';
import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';

const DonateModal = () => {
  const { activeModal, closeModal } = useModals();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(1000);
  const [frequency, setFrequency] = useState('One Time');
  const [payMode, setPayMode] = useState('upi');
  const [receiptId, setReceiptId] = useState('');
  
  const [formData, setFormData] = useState({
    donorName: '',
    dob: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    pan: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (activeModal !== 'donate') return null;

  const handleNextStep1 = () => setStep(2);
  const handleNextStep2 = (e) => {
    e.preventDefault();
    setStep(3);
  };
  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    setSubmitting(true);
    setError('');
    
    const mockTxnId = `TXN-${Math.floor(Math.random() * 100000000)}`;
    const mockReceipt = `EM-80G-${Math.floor(Math.random() * 1000000)}`;

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: formData.donorName,
          email: formData.email,
          phone: formData.phone,
          pan: formData.pan,
          amount: amount,
          txnId: mockTxnId
        })
      });

      if (!res.ok) {
        throw new Error('Failed to process donation. Please try again.');
      }

      setReceiptId(mockReceipt);
      setStep(4); // Success screen
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setAmount(1000);
    setFrequency('One Time');
    setFormData({ donorName: '', dob: '', email: '', phone: '', address: '', pincode: '', pan: '' });
    setError('');
    closeModal();
  };

  const TEMP_DISABLED = true;

  if (TEMP_DISABLED) {
    return (
      <div className="modal-overlay open" id="donate-modal" style={{ display: 'flex' }}>
        <div className="modal-card donate-modal-card glass-card" style={{ maxWidth: '500px', textAlign: 'center', padding: '40px 25px' }}>
          <button className="modal-close-btn" onClick={handleClose}><i className="fa-solid fa-xmark"></i></button>
          <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--primary-orange)', fontSize: '4rem', marginBottom: '20px', display: 'block' }}></i>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#fff' }}>We are not accepting Donation Right Now</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', marginBottom: '30px' }}>
            Do connect if you want further clarity in our mail.
          </p>
          <button className="btn btn-primary w-100" onClick={handleClose}>Close Window</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay open" id="donate-modal" style={{ display: 'flex' }}>
      <div className="modal-card donate-modal-card glass-card">
        <button className="modal-close-btn" onClick={handleClose}><i className="fa-solid fa-xmark"></i></button>
        
        {step < 4 && (
          <div className="donate-header text-center">
            <i className="fa-solid fa-heart-pulse donate-icon"></i>
            <h2>Support the Cause, Make a Difference</h2>
            <p>Eligible for 50% tax benefit under Section 80G.</p>
            <div className="step-tracker">
              <span className={`step-dot ${step >= 1 ? 'active' : ''}`}>1. Amount</span>
              <span className="step-line"></span>
              <span className={`step-dot ${step >= 2 ? 'active' : ''}`}>2. Personal Info</span>
              <span className="step-line"></span>
              <span className={`step-dot ${step >= 3 ? 'active' : ''}`}>3. Payment</span>
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="donate-step-panel active">
            <div className="form-group text-center">
              <label className="form-label-bold">Choose Frequency</label>
              <div className="frequency-toggle-group">
                <button className={`freq-btn ${frequency === 'One Time' ? 'active' : ''}`} onClick={() => setFrequency('One Time')}>One Time</button>
                <button className={`freq-btn ${frequency === 'Monthly' ? 'active' : ''}`} onClick={() => setFrequency('Monthly')}>Monthly</button>
              </div>
            </div>
            <div className="amount-grid">
              {[1000, 3000, 6000, 12000].map(val => (
                <button key={val} className={`amount-btn ${amount === val ? 'active' : ''}`} onClick={() => setAmount(val)}>
                  <span className="amt">₹ {val.toLocaleString()}</span>
                  <span className="amt-desc">Support package</span>
                </button>
              ))}
            </div>
            <div className="form-group" style={{ marginTop: '10px' }}>
              <label>Or Enter Custom Amount (INR)</label>
              <div className="input-icon-wrapper">
                <i className="fa-solid fa-indian-rupee-sign"></i>
                <input type="number" className="form-control pad-left" placeholder="Enter other amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
              </div>
            </div>
            <div className="modal-action-footer">
              <div></div>
              <button className="btn btn-primary" onClick={handleNextStep1} disabled={!amount || amount <= 0}>Next Step <i className="fa-solid fa-arrow-right"></i></button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="donate-step-panel active">
            <form onSubmit={handleNextStep2}>
              <h3 className="form-subtitle">Donor Details (Mandatory for tax certificate)</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" name="donorName" value={formData.donorName} onChange={handleInputChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="form-control" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="form-control" placeholder="+91 xxxxxxxxxx" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Address *</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="form-control" required />
                </div>
              </div>
              <div className="form-group">
                <label>PAN Number * (Required for 80G)</label>
                <input type="text" name="pan" value={formData.pan} onChange={handleInputChange} className="form-control uppercase" placeholder="ABCDE1234F" pattern="[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}" required />
              </div>
              <div className="form-group checkbox-group" style={{ marginTop: '10px' }}>
                <input type="checkbox" id="d-agree" required defaultChecked />
                <label htmlFor="d-agree" className="checkbox-label">You agree that Emyris Foundation can reach out to you through WhatsApp/Email/SMS/Phone.</label>
              </div>
              <div className="modal-action-footer" style={{ marginTop: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}><i className="fa-solid fa-arrow-left"></i> Back</button>
                <button type="submit" className="btn btn-primary">Proceed to Payment <i className="fa-solid fa-arrow-right"></i></button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="donate-step-panel active">
            <div className="summary-box glass-card">
              <h4>Donation Summary</h4>
              <div className="summary-line">
                <span>Contribution Amount:</span>
                <strong className="text-orange">₹ {amount.toLocaleString()}</strong>
              </div>
              <div className="summary-line">
                <span>Frequency:</span>
                <strong>{frequency}</strong>
              </div>
            </div>
            <h3 className="form-subtitle" style={{ marginTop: '10px' }}>Select Payment Mode</h3>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <div className="payment-tabs">
              <button className={`pay-tab ${payMode === 'upi' ? 'active' : ''}`} onClick={() => setPayMode('upi')}><i className="fa-solid fa-qrcode"></i> UPI / QR</button>
              <button className={`pay-tab ${payMode === 'card' ? 'active' : ''}`} onClick={() => setPayMode('card')}><i className="fa-solid fa-credit-card"></i> Card</button>
            </div>
            <div className="payment-tab-contents" style={{ marginTop: '10px' }}>
              {payMode === 'upi' && (
                <div className="pay-panel active text-center">
                  <p>Scan this QR code using BHIM, GPAY, PHONEPE or PAYTM to simulate donation</p>
                  <div className="qr-code-box">
                    <i className="fa-solid fa-qrcode" style={{ fontSize: '100px', color: 'var(--primary-blue)' }}></i>
                  </div>
                </div>
              )}
              {payMode === 'card' && (
                <div className="pay-panel active">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input type="text" className="form-control" placeholder="4111 2222 3333 4444" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input type="text" className="form-control" placeholder="MM/YY" />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input type="password" className="form-control" placeholder="***" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-action-footer" style={{ marginTop: '15px' }}>
              <button className="btn btn-outline" onClick={() => setStep(2)} disabled={submitting}><i className="fa-solid fa-arrow-left"></i> Back</button>
              <button className="btn btn-primary" onClick={handlePayment} disabled={submitting}>
                {submitting ? 'Processing...' : 'Complete Payment'} <i className="fa-solid fa-circle-check"></i>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 (Success) */}
        {step === 4 && (
          <div className="donate-step-panel active text-center">
            <i className="fa-solid fa-circle-check success-check-icon"></i>
            <h2>Thank You, {formData.donorName.split(' ')[0]}!</h2>
            <p className="lead-para">Your payment simulation was successful.</p>
            <div className="receipt-box glass-card">
              <p>Receipt ID: <strong>{receiptId}</strong></p>
              <p>We have recorded your details and sent an 80G tax certificate to your registered email.</p>
            </div>
            <button className="btn btn-primary" onClick={handleClose} style={{ marginTop: '15px' }}>Return to Site</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonateModal;
