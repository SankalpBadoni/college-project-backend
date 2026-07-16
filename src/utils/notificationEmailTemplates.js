const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  if (value instanceof Date) {
    return value.toLocaleString();
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

const renderDetailList = (details = {}, labelMap = {}) => {
  const items = Object.entries(details)
    .map(([key, value]) => ({ key, value: formatValue(value), label: labelMap[key] || key }))
    .filter(({ value }) => value);

  if (!items.length) {
    return "";
  }

  return `
    <ul style="margin: 16px 0; padding-left: 18px; color: #334155; line-height: 1.7;">
      ${items
        .map(
          ({ label, value }) => `
            <li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</li>
          `
        )
        .join("")}
    </ul>
  `;
};

const renderOfferDetails = (details = {}) => {
  const entries = [
    ["date", "Joining date"],
    ["stipendSalary", "Stipend / Salary"],
    ["salary", "Stipend / Salary"],
    ["joiningDate", "Joining date"],
    ["jobLocation", "Location"]
  ];

  const seen = new Set();
  const rows = [];

  for (const [key, label] of entries) {
    const value = formatValue(details[key]);
    if (!value || seen.has(label)) {
      continue;
    }

    seen.add(label);
    rows.push(`
      <tr>
        <td style="padding: 0 0 10px; font-weight: 700; color: #0f172a; white-space: nowrap;">${escapeHtml(label)}</td>
        <td style="padding: 0 0 10px 14px; color: #334155;">${escapeHtml(value)}</td>
      </tr>
    `);
  }

  return rows.length
    ? `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 16px 0 0; border-collapse: collapse; width: 100%;">
        <tbody>
          ${rows.join("")}
        </tbody>
      </table>
    `
    : "";
};

const createShell = ({ headline, intro, detailsHtml, closing }) => `
  <div style="font-family: Arial, Helvetica, sans-serif; background: #f8fafc; padding: 24px; color: #0f172a;">
    <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 28px;">
      <div style="font-size: 22px; font-weight: 700; margin-bottom: 16px;">${escapeHtml(headline)}</div>
      <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.7; color: #334155;">${escapeHtml(intro)}</p>
      ${detailsHtml || ""}
      <p style="margin: 16px 0 0; font-size: 15px; line-height: 1.7; color: #334155;">${escapeHtml(closing)}</p>
    </div>
  </div>
`;

export const buildStudentInterviewEmail = ({ studentName, posting, employerName, interviewDetails = {}, note }) => {
  const subject = `Interview Scheduled: ${posting.title || "Job Opportunity"}`;
  const detailsHtml = renderDetailList(interviewDetails, {
    date: "Interview date",
    time: "Interview time",
    type: "Interview type",
    venue: "Venue",
    contactPerson: "Contact person",
    meetingLink: "Meeting link"
  });

  const noteHtml = note
    ? `<p style="margin: 16px 0 0; font-size: 15px; line-height: 1.7; color: #334155;"><strong>Note:</strong> ${escapeHtml(note)}</p>`
    : "";

  return {
    subject,
    html: createShell({
      headline: `Interview update for ${studentName || "student"}`,
      intro: `You have been shortlisted for ${posting.title || "this role"} at ${employerName || posting.companyName || "the employer"}.`,
      detailsHtml: `${detailsHtml}${noteHtml}`,
      closing: "Please review the schedule in your dashboard and prepare accordingly."
    })
  };
};

export const buildStudentOfferEmail = ({ studentName, posting, employerName, offerDetails = {}, note }) => {
  const subject = `Hiring Offer Received: ${posting.title || "Job Opportunity"}`;
  const detailsHtml = renderOfferDetails(offerDetails);

  const noteHtml = note
    ? `<div style="margin: 18px 0 0; padding: 14px 16px; border-left: 4px solid #2563eb; background: #eff6ff; border-radius: 10px; font-size: 15px; line-height: 1.7; color: #334155;"><strong>Message from employer:</strong> ${escapeHtml(note)}</div>`
    : "";

  return {
    subject,
    html: createShell({
      headline: `Congratulations, ${studentName || "student"}`,
      intro: `${employerName || posting.companyName || "The employer"} has extended a hiring offer for ${posting.title || "the position"}.`,
      detailsHtml: detailsHtml ? `<div style="margin-top: 6px;">${detailsHtml}</div>${noteHtml}` : noteHtml,
      closing: "You can accept or decline this offer from your applications or notifications page."
    })
  };
};

export const buildEmployerResponseEmail = ({ studentName, posting, isOffer, isAccepted }) => {
  const responseLabel = isAccepted ? "accepted" : "declined";
  const subject = isOffer
    ? `Offer ${isAccepted ? "Accepted" : "Declined"}: ${posting.title || "Job Opportunity"}`
    : `Candidate Response: ${posting.title || "Job Opportunity"}`;

  return {
    subject,
    html: createShell({
      headline: `${studentName || "A candidate"} ${responseLabel} your ${isOffer ? "offer" : "interview invitation"}`,
      intro: `${studentName || "The student"} has ${responseLabel} the ${isOffer ? "hiring offer" : "interview/shortlist invitation"} for ${posting.title || "the position"} at ${posting.companyName || "your company"}.`,
      detailsHtml: "",
      closing: "Please review the candidate status in the employer dashboard."
    })
  };
};