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

  if (activeModal !== 'donate') return null;

  const handleNextStep1 = () => setStep(2);
  const handleNextStep2 = (e) => {
    e.preventDefault();
    setStep(3);
  };
  const handlePayment = () => {
    // Simulate payment
    const mockReceipt = `EM-80G-${Math.floor(Math.random() * 1000000)}`;
    setReceiptId(mockReceipt);
    setStep(4); // Success screen
  };

  const handleClose = () => {
    setStep(1);
    closeModal();
  };

  return (
    <div className="modal-overlay" id="donate-modal" style={{ display: 'flex' }}>
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
            <div className="form-group" style={{ marginTop: '15px' }}>
              <label>Or Enter Custom Amount (INR)</label>
              <div className="input-icon-wrapper">
                <i className="fa-solid fa-indian-rupee-sign"></i>
                <input type="number" className="form-control pad-left" placeholder="Enter other amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
              </div>
            </div>
            <div className="modal-action-footer">
              <div></div>
              <button className="btn btn-primary" onClick={handleNextStep1}>Next Step <i className="fa-solid fa-arrow-right"></i></button>
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
                  <input type="text" className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input type="date" className="form-control" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" className="form-control" placeholder="+91 xxxxxxxxxx" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Address *</label>
                  <input type="text" className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input type="text" className="form-control" required />
                </div>
              </div>
              <div className="form-group">
                <label>PAN Number * (Required for 80G)</label>
                <input type="text" className="form-control uppercase" placeholder="ABCDE1234F" pattern="[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}" required />
              </div>
              <div className="form-group checkbox-group" style={{ marginTop: '15px' }}>
                <input type="checkbox" id="d-agree" required defaultChecked />
                <label htmlFor="d-agree" className="checkbox-label">You agree that Emyris Foundation can reach out to you through WhatsApp/Email/SMS/Phone.</label>
              </div>
              <div className="modal-action-footer" style={{ marginTop: '20px' }}>
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
            <h3 className="form-subtitle" style={{ marginTop: '15px' }}>Select Payment Mode</h3>
            <div className="payment-tabs">
              <button className={`pay-tab ${payMode === 'upi' ? 'active' : ''}`} onClick={() => setPayMode('upi')}><i className="fa-solid fa-qrcode"></i> UPI / QR</button>
              <button className={`pay-tab ${payMode === 'card' ? 'active' : ''}`} onClick={() => setPayMode('card')}><i className="fa-solid fa-credit-card"></i> Card</button>
            </div>
            <div className="payment-tab-contents" style={{ marginTop: '15px' }}>
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
            <div className="modal-action-footer" style={{ marginTop: '25px' }}>
              <button className="btn btn-outline" onClick={() => setStep(2)}><i className="fa-solid fa-arrow-left"></i> Back</button>
              <button className="btn btn-primary" onClick={handlePayment}>Complete Payment <i className="fa-solid fa-circle-check"></i></button>
            </div>
          </div>
        )}

        {/* STEP 4 (Success) */}
        {step === 4 && (
          <div className="donate-step-panel active text-center">
            <i className="fa-solid fa-circle-check success-check-icon"></i>
            <h2>Thank You, Generous Donor!</h2>
            <p className="lead-para">Your payment simulation was successful.</p>
            <div className="receipt-box glass-card">
              <p>Receipt ID: <strong>{receiptId}</strong></p>
              <p>We have recorded your details and sent an 80G tax certificate to your registered email.</p>
            </div>
            <button className="btn btn-primary" onClick={handleClose} style={{ marginTop: '20px' }}>Return to Site</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonateModal;
