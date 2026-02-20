import { useState } from 'react';

function Form({ schema }) {
  const { formId, title, description, fields, submitUrl, outputFile } = schema;
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    fields.forEach(field => {
      const value = formData[field.name];

      if (field.required && (!value || value.toString().trim() === '')) {
        newErrors[field.name] = `${field.label} is required`;
      }

      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.name] = 'Invalid email address';
        }
      }

      if (field.type === 'number' && value !== undefined && value !== '') {
        const num = Number(value);
        if (isNaN(num)) {
          newErrors[field.name] = 'Must be a number';
        } else {
          if (field.min !== undefined && num < field.min) {
            newErrors[field.name] = `Must be at least ${field.min}`;
          }
          if (field.max !== undefined && num > field.max) {
            newErrors[field.name] = `Must be at most ${field.max}`;
          }
        }
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit to server
    try {
      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId,
          data: formData,
          outputFile
        })
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({});
        setErrors({});

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    }
  };

  const renderField = (field) => {
    const value = formData[field.name] || '';
    const hasError = errors[field.name];

    const baseStyle = {
      width: '100%',
      padding: '0.75rem',
      border: `1px solid ${hasError ? '#ef4444' : '#333'}`,
      borderRadius: '4px',
      fontSize: '1rem',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      fontFamily: 'inherit'
    };

    const labelStyle = {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '500',
      color: hasError ? '#ef4444' : '#fff'
    };

    const errorStyle = {
      color: '#ef4444',
      fontSize: '0.875rem',
      marginTop: '0.25rem'
    };

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>
              {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={field.rows || 4}
              style={{ ...baseStyle, resize: 'vertical' }}
            />
            {hasError && <div style={errorStyle}>{errors[field.name]}</div>}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>
              {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              style={baseStyle}
            >
              <option value="">-- Select --</option>
              {field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {hasError && <div style={errorStyle}>{errors[field.name]}</div>}
          </div>
        );

      case 'number':
        return (
          <div key={field.name} style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>
              {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              style={baseStyle}
            />
            {hasError && <div style={errorStyle}>{errors[field.name]}</div>}
          </div>
        );

      default: // text, email, etc.
        return (
          <div key={field.name} style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>
              {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
            </label>
            <input
              type={field.type}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              style={baseStyle}
            />
            {hasError && <div style={errorStyle}>{errors[field.name]}</div>}
          </div>
        );
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{title}</h2>
        {description && (
          <p style={{ opacity: 0.7, fontSize: '1rem' }}>{description}</p>
        )}
      </div>

      {submitStatus === 'success' && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#10b981',
          color: '#fff',
          borderRadius: '4px',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          Feedback saved successfully!
        </div>
      )}

      {submitStatus === 'error' && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#ef4444',
          color: '#fff',
          borderRadius: '4px',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          Failed to save feedback. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {fields.map(field => renderField(field))}

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.875rem',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          Save Feedback
        </button>
      </form>
    </div>
  );
}

export default Form;
