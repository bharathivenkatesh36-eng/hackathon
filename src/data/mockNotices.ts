import { Notice } from '../types/notice';

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'notice-irs-5071c',
    title: 'IRS Letter 5071C - Potential Identity Verification & Tax Return Processing Hold',
    issuingAuthority: 'Internal Revenue Service (IRS)',
    authorityType: 'IRS / Federal Tax',
    category: 'Tax & Financial',
    referenceNumber: 'LTR-5071C / Batch: 2026-TX-90412',
    receivedDate: '2026-10-15',
    issueDate: '2026-10-12',
    deadlineDate: '2026-11-11',
    deadlineSource: 'Letter 5071C Page 1, Paragraph 3: "Please contact us or complete identity verification within 30 days of the date of this letter."',
    deadlineType: 'calendar_days',
    urgency: 'urgent',
    status: 'needs_attention',
    confidenceScore: 98,
    plainLanguageSummary:
      'The IRS received an income tax return filed under your business Employer Identification Number (EIN), but flagged potential identity discrepancies. They have placed an immediate administrative hold on processing. You must verify that your company authorized this return within 30 days, or the return will be rejected and prior refund/credits will remain frozen.',
    whyIssued: {
      trigger: 'Automated Return Integrity Verification System flagged mismatch between reported officer compensation and Form W-2 data submitted to Social Security Administration.',
      officialRationale: 'To protect taxpayers and corporate entities from fraudulent returns and unauthorized tax filings under 26 U.S.C. § 6011.',
      businessRisk: 'Rejection of corporate tax filing, failure-to-file statutory penalties ($210/month per shareholder), delay of legitimate refund, and potential IRS audit examination flag.'
    },
    mandatoryActions: [
      {
        id: 'irs-m1',
        title: 'Complete Online ID.me Verification or Schedule Taxpayer Protection Call',
        deadline: '2026-11-11',
        description: 'Access the IRS Identity Verification Service at idverify.irs.gov using your business credentials and corporate officer identification.',
        statutoryRef: 'IRS Notice 2026-5071C',
        completed: false
      },
      {
        id: 'irs-m2',
        title: 'Verify Form 1120-S Line Items with Company CPA',
        deadline: '2026-11-05',
        description: 'Cross-reference Schedule K-1 allocations and gross receipts reported on the submitted Form 1120-S against internal general ledger.',
        completed: true
      }
    ],
    suggestedPreparations: [
      {
        id: 'irs-s1',
        title: 'Pull Prior Year Tax Return (2024 Form 1120-S)',
        timeframe: 'Prior to calling IRS verification line',
        description: 'The IRS telephone agent will ask specific line items from your 2024 filed return (e.g., Line 1a Gross Receipts and Line 21 Ordinary Business Income) as identity security questions.',
        completed: true
      },
      {
        id: 'irs-s2',
        title: 'Draft Authorization Letter from Managing Member',
        timeframe: 'Within 5 business days',
        description: 'Prepare an officer verification declaration confirming the signing officer has statutory signature authority under IRS Form 2848 or corporate bylaws.',
        completed: false
      }
    ],
    documentChecklist: [
      {
        id: 'irs-doc-1',
        name: 'Letter 5071C Original Copy',
        description: 'Contains the 14-digit control code required on idverify.irs.gov.',
        collected: true,
        mandatory: true,
        locationHint: 'Physical mail or scan in safe deposit / company binder'
      },
      {
        id: 'irs-doc-2',
        name: 'Filed 2025 Form 1120-S Tax Return Copy',
        description: 'Exact copy submitted to IRS, including all schedules and statements.',
        collected: true,
        mandatory: true,
        locationHint: 'CPA client portal or accounting drive'
      },
      {
        id: 'irs-doc-3',
        name: 'Prior Year (2024) Filed Form 1120-S Tax Return',
        description: 'Required by telephone verification officer for identity validation questions.',
        collected: false,
        mandatory: true,
        locationHint: 'Permanent corporate tax records'
      },
      {
        id: 'irs-doc-4',
        name: 'Government-Issued Photo ID of Corporate Officer',
        description: 'Passport or State Driver’s License for ID.me biometric verification.',
        collected: true,
        mandatory: true,
        locationHint: 'Authorized Managing Partner / President'
      }
    ],
    legalCitations: [
      {
        code: '26 U.S.C. § 6011',
        title: 'General Requirement of Return, Statement, or List',
        excerpt: 'Every person made liable for any tax shall make a return or statement according to the forms and regulations prescribed by the Secretary.',
        plainMeaning: 'Federal law empowering the IRS to require verified verification before accepting corporate filings.'
      },
      {
        code: '26 CFR § 301.6061-1',
        title: 'Signing of Returns and Other Documents',
        excerpt: 'Each return, statement, or other document required under the Internal Revenue laws shall be signed by the person required to make such return or authorized agent.',
        plainMeaning: 'Only officers with documented corporate signing authority may file on behalf of the corporation.'
      }
    ],
    missingOrUncertain: [
      {
        item: 'Direct Telephone Extension of Assigned Reviewer',
        reason: 'Letter provides only the general automated Taxpayer Protection Program toll-free line (800-830-5084), not a direct case agent.',
        severity: 'low',
        suggestedVerification: 'Be prepared for 30-45 minute wait time on Tuesday or Wednesday morning.'
      },
      {
        item: 'Specific Schedule Triggering Flag',
        reason: 'Notice does not reveal whether the flag was triggered by identity theft suspicions or by electronic filer checksum discrepancies.',
        severity: 'medium',
        suggestedVerification: 'Ask the phone agent directly for the internal reason code once identity is authenticated.'
      }
    ],
    sourceSnippets: [
      {
        id: 'irs-snip-1',
        section: 'Page 1, Header',
        page: 1,
        originalText: 'INTERNAL REVENUE SERVICE, AUSTIN TX 73301. Date: October 12, 2026. In reference to: Form 1120-S. Notice Number: LTR 5071C.',
        verifiedFact: 'Notice issued by IRS Austin Campus on October 12, 2026 regarding Form 1120-S return.'
      },
      {
        id: 'irs-snip-2',
        section: 'Page 1, Paragraph 2',
        page: 1,
        originalText: 'We received your Form 1120-S for the tax year ending December 31, 2025. To protect you from identity theft, we need you to verify your identity before we can process your return or issue any refund.',
        verifiedFact: 'Return processing is suspended until officer identity is verified.'
      },
      {
        id: 'irs-snip-3',
        section: 'Page 1, Action Required',
        page: 1,
        originalText: 'You must respond within 30 days from the date of this letter. If you do not respond within 30 days, we will not process your tax return, which may cause penalties and interest to accrue.',
        verifiedFact: 'Explicit 30-day statutory deadline expiring November 11, 2026.'
      }
    ],
    fileName: 'IRS_Notice_5071C_Redacted.pdf',
    fileSize: '1.4 MB'
  },
  {
    id: 'notice-osha-citation',
    title: 'OSHA Notice of Alleged Safety Hazard & 15-Day Informal Conference Notice',
    issuingAuthority: 'U.S. Department of Labor - OSHA Region 9',
    authorityType: 'Labor & Workplace Safety (OSHA)',
    category: 'Regulatory & Labor',
    referenceNumber: 'OSHA-R9-2026-INSP-1849201',
    receivedDate: '2026-10-18',
    issueDate: '2026-10-16',
    deadlineDate: '2026-11-06',
    deadlineSource: 'OSHA Citation and Notification of Penalty, Section 2: "You have 15 working days from receipt of this citation to contest or request an Informal Conference."',
    deadlineType: 'business_days',
    urgency: 'urgent',
    status: 'needs_attention',
    confidenceScore: 97,
    plainLanguageSummary:
      'OSHA conducted an unannounced inspection of your commercial facility following an employee report. They cited your business for two "Serious" electrical safety infractions (blocked emergency power disconnects and ungrounded bench grinder) with proposed penalties totaling $14,502. You have 15 working days to either pay, dispute, or request an Informal Conference with the Area Director to negotiate penalty reductions and abatement timelines.',
    whyIssued: {
      trigger: 'On-site safety inspection conducted on September 29, 2026 revealed physical violations of General Industry Safety Standards.',
      officialRationale: 'Enforcement of occupational safety standards pursuant to Section 9(a) of the Occupational Safety and Health Act of 1970.',
      businessRisk: 'Mandatory penalties become a final non-appealable order after 15 working days; failure to abate leads to $16,131/day recurring penalties under federal guidelines.'
    },
    mandatoryActions: [
      {
        id: 'osha-m1',
        title: 'Post Citation at Facility Notice Board Near Violation Site',
        deadline: '2026-10-21',
        description: 'Federal law requires posting a copy of this citation at or near the violation site for at least 3 working days or until violations are abated.',
        statutoryRef: '29 CFR 1903.16',
        completed: true
      },
      {
        id: 'osha-m2',
        title: 'Request Informal Conference with OSHA Area Director in Writing',
        deadline: '2026-11-06',
        description: 'Send formal written request to Area Director requesting an informal conference to discuss abatement terms and standard 40-50% penalty mitigation.',
        statutoryRef: '29 CFR 1903.20',
        completed: false
      }
    ],
    suggestedPreparations: [
      {
        id: 'osha-s1',
        title: 'Photograph Corrective Actions Taken Immediately',
        timeframe: 'Within 48 hours',
        description: 'Take high-resolution photos of cleared 36-inch clearance in front of electrical disconnect panel and grounded machinery with timestamp verification.',
        completed: true
      },
      {
        id: 'osha-s2',
        title: 'Compile Written Injury & Illness Prevention Program (IIPP)',
        timeframe: 'Before informal conference',
        description: 'Having a documented employee training log and active safety committee demonstrates "good faith," which grants a 25% statutory penalty reduction.',
        completed: false
      }
    ],
    documentChecklist: [
      {
        id: 'osha-doc-1',
        name: 'OSHA Citation and Notification of Penalty Form',
        description: 'Original 8-page document with Citation 1 Item 1 and Item 2 details.',
        collected: true,
        mandatory: true,
        locationHint: 'Facility Manager Desk'
      },
      {
        id: 'osha-doc-2',
        name: 'Photographic Proof of Abatement',
        description: 'Clear photos of rewired grounding plug and unblocked 36-inch electrical panels.',
        collected: true,
        mandatory: true,
        locationHint: 'Safety maintenance log'
      },
      {
        id: 'osha-doc-3',
        name: 'OSHA Form 300 / 300A Summary Logs (Past 3 Years)',
        description: 'Required during informal conference to demonstrate employer safety record.',
        collected: false,
        mandatory: false,
        locationHint: 'HR records folder'
      }
    ],
    legalCitations: [
      {
        code: '29 CFR 1910.303(g)(1)',
        title: 'Space About Electrical Equipment',
        excerpt: 'Sufficient access and working space shall be provided and maintained about all electric equipment to permit ready and safe operation and maintenance of such equipment.',
        plainMeaning: 'All electrical circuit boxes must have an unobstructed 36-inch radius at all times.'
      },
      {
        code: 'Section 10(a) of the OSH Act',
        title: 'Procedure for Enforcement',
        excerpt: 'The employer has fifteen working days within which to notify the Secretary that he wishes to contest the citation or proposed assessment of penalty.',
        plainMeaning: 'Strict 15-business-day window to respond; missing it forfeits all legal defense rights.'
      }
    ],
    missingOrUncertain: [
      {
        item: 'Assigned Informal Conference Hearing Date',
        reason: 'The notice sets the deadline to request the conference, but the conference date itself must be agreed upon by phone or email.',
        severity: 'medium',
        suggestedVerification: 'Follow up by phone within 48 hours of emailing the written conference request.'
      }
    ],
    sourceSnippets: [
      {
        id: 'osha-snip-1',
        section: 'Page 1, Notice of Penalty',
        page: 1,
        originalText: 'THE LAW GIVES YOU THIRTY DAYS TO PAY OR FIFTEEN WORKING DAYS TO CONTEST. Total Proposed Penalty: $14,502.00.',
        verifiedFact: 'Total proposed penalty is $14,502; 15 working day contest period.'
      },
      {
        id: 'osha-snip-2',
        section: 'Page 3, Citation 1 Item 1',
        page: 3,
        originalText: 'Type of Violation: Serious. 29 CFR 1910.303(g)(1): Working space about electric equipment was blocked by stored shipping pallets.',
        verifiedFact: 'Violation classified as Serious due to blocked electrical access.'
      }
    ],
    fileName: 'OSHA_Citation_Notice_01_2026.pdf',
    fileSize: '2.8 MB'
  },
  {
    id: 'notice-cdtfa-tax-audit',
    title: 'California CDTFA Notice of Sales & Use Tax Audit Engagement & Records Demand',
    issuingAuthority: 'California Department of Tax and Fee Administration (CDTFA)',
    authorityType: 'State Tax & Revenue',
    category: 'Tax & Financial',
    referenceNumber: 'CDTFA-AUD-2026-881290',
    receivedDate: '2026-10-08',
    issueDate: '2026-10-05',
    deadlineDate: '2026-11-20',
    deadlineSource: 'Form CDTFA-1100-A, Page 2: "Please return the completed Pre-Audit Information Questionnaire and preliminary sales logs by November 20, 2026."',
    deadlineType: 'calendar_days',
    urgency: 'upcoming',
    status: 'under_review',
    confidenceScore: 99,
    plainLanguageSummary:
      'The California Department of Tax and Fee Administration is conducting a routine audit of your retail and wholesale sales tax filings covering January 1, 2024 through December 31, 2025. They require point-of-sale register tapes, 1099-K payment processing records, and copies of valid resale certificates for non-taxed transactions.',
    whyIssued: {
      trigger: 'Automated 1099-K cross-matching flagged a 4.2% discrepancy between gross credit card processor reports and declared non-taxable sales.',
      officialRationale: 'Periodic statutory audit of sales and use tax liability under California Revenue and Taxation Code Section 7054.',
      businessRisk: 'Unsubstantiated exempt sales will be reclassified as taxable gross sales, incurring 10% negligence penalties plus state statutory interest.'
    },
    mandatoryActions: [
      {
        id: 'cdtfa-m1',
        title: 'Complete and Return Pre-Audit Information Questionnaire (CDTFA-1100)',
        deadline: '2026-11-20',
        description: 'Complete the 4-page questionnaire describing POS software, merchant accounts, and warehouse inventory systems.',
        completed: false
      },
      {
        id: 'cdtfa-m2',
        title: 'Gather Customer Resale Certificates (CDTFA-230)',
        deadline: '2026-11-20',
        description: 'Verify that every B2B invoice claiming tax exemption has a signed and active CDTFA-230 certificate on file.',
        completed: false
      }
    ],
    suggestedPreparations: [
      {
        id: 'cdtfa-s1',
        title: 'Reconcile Square/Stripe 1099-K Totals with Form CDTFA-401-A2',
        timeframe: 'Before initial auditor meeting',
        description: 'Identify merchant processor chargebacks, tips, and sales tax collected to explain gross difference.',
        completed: true
      }
    ],
    documentChecklist: [
      {
        id: 'cdtfa-doc-1',
        name: 'Form CDTFA-1100-A Engagement Notice',
        description: 'Official notice identifying Auditor Jane Doe and District Office contact.',
        collected: true,
        mandatory: true,
        locationHint: 'Controller file'
      },
      {
        id: 'cdtfa-doc-2',
        name: '1099-K Forms from Stripe / Square (2024 & 2025)',
        description: 'Annual merchant processing summary reports.',
        collected: true,
        mandatory: true,
        locationHint: 'Payment processor portals'
      },
      {
        id: 'cdtfa-doc-3',
        name: 'B2B Resale Certificates on File',
        description: 'Signed certificates for all wholesale non-taxed accounts.',
        collected: false,
        mandatory: true,
        locationHint: 'Customer accounting master files'
      }
    ],
    legalCitations: [
      {
        code: 'Cal. Rev. & Tax. Code § 7054',
        title: 'Examination of Books and Records',
        excerpt: 'The board may examine the books, papers, records, and other data of any person selling tangible personal property.',
        plainMeaning: 'Auditors have legal subpoena power to inspect digital point-of-sale databases and bank statements.'
      }
    ],
    missingOrUncertain: [
      {
        item: 'Whether Audit Will Be Conducted On-Site or Remote / Electronic',
        reason: 'Notice mentions electronic file submission via CDTFA portal is preferred, but reserves on-site inventory inspection.',
        severity: 'low',
        suggestedVerification: 'Request 100% remote desk audit during initial questionnaire response.'
      }
    ],
    sourceSnippets: [
      {
        id: 'cdtfa-snip-1',
        section: 'Page 1, Scope of Audit',
        page: 1,
        originalText: 'Audit Period: 01/01/2024 through 12/31/2025. Tax Program: Sales and Use Tax. Reason: Cyclic Audit Selection.',
        verifiedFact: 'Audit covers 8 calendar quarters (Jan 2024 – Dec 2025).'
      }
    ],
    fileName: 'CDTFA_Audit_Notice_2026.pdf',
    fileSize: '1.9 MB'
  },
  {
    id: 'notice-lease-cure',
    title: 'Commercial Lease Default Notice - Notice to Cure CAM & Insurance Deficiencies',
    issuingAuthority: 'Pinnacle Commercial Realty Trust (Landlord)',
    authorityType: 'Commercial & Real Estate',
    category: 'Commercial Contract',
    referenceNumber: 'LEASE-SUITE-402-BLDG-B',
    receivedDate: '2026-10-20',
    issueDate: '2026-10-20',
    deadlineDate: '2026-10-30',
    deadlineSource: 'Notice to Cure, Section 4: "Tenant must cure all stated non-monetary and monetary defaults within ten (10) calendar days of service."',
    deadlineType: 'calendar_days',
    urgency: 'urgent',
    status: 'needs_attention',
    confidenceScore: 95,
    plainLanguageSummary:
      'Your commercial building landlord has issued a formal 10-day Notice to Cure. They allege two defaults under Section 14 of your lease: (1) missing Certificate of Commercial General Liability Insurance naming Landlord as additional insured for the 2026-2027 policy year, and (2) an unpaid common area maintenance (CAM) annual true-up charge of $1,840.00. You have 10 calendar days to cure or face lease termination proceedings.',
    whyIssued: {
      trigger: 'Annual landlord compliance audit revealed missing renewal insurance endorsement and unpaid Q3 CAM reconciliation invoice.',
      officialRationale: 'Contractual enforcement of Lease Agreement Section 14.2 (Default and Remedies).',
      businessRisk: 'Failure to cure within 10 days permits landlord to serve 3-day notice to quit, lock out tenant, and accelerate remaining lease liability.'
    },
    mandatoryActions: [
      {
        id: 'lease-m1',
        title: 'Request Additional Insured Endorsement from Commercial Insurance Broker',
        deadline: '2026-10-25',
        description: 'Instruct broker to issue ACORD-25 Certificate naming "Pinnacle Commercial Realty Trust" as Certificate Holder and Additional Insured.',
        completed: false
      },
      {
        id: 'lease-m2',
        title: 'Review CAM Reconciliation Statement & Pay or Dispute $1,840',
        deadline: '2026-10-28',
        description: 'Verify proportionate share calculation (Suite 402 = 4.2% of building square footage) and wire payment under protest if disputed.',
        completed: false
      }
    ],
    suggestedPreparations: [
      {
        id: 'lease-s1',
        title: 'Review Lease Section 14.2 Notice Requirements',
        timeframe: 'Immediate',
        description: 'Verify whether landlord served notice by certified mail or personal service as required by contract terms.',
        completed: true
      }
    ],
    documentChecklist: [
      {
        id: 'lease-doc-1',
        name: 'Notice to Cure Document and Proof of Service',
        description: 'Notice delivered to suite reception on Oct 20.',
        collected: true,
        mandatory: true,
        locationHint: 'Office Manager Desk'
      },
      {
        id: 'lease-doc-2',
        name: 'Current ACORD-25 Certificate of Liability Insurance',
        description: '$2,000,000 general aggregate policy with Hartford.',
        collected: true,
        mandatory: true,
        locationHint: 'Insurance policy portal'
      }
    ],
    legalCitations: [
      {
        code: 'Commercial Lease Agreement § 14.2',
        title: 'Events of Default and Landlord Cure Remedies',
        excerpt: 'Tenant shall have ten (10) days following written notice to cure any monetary or non-monetary failure.',
        plainMeaning: 'Strict 10-day cure window established by mutually executed contract.'
      }
    ],
    missingOrUncertain: [
      {
        item: 'Detailed Itemization of Landlord HVAC CAM Expense',
        reason: 'Notice attaches a lump sum bill of $1,840 but does not include underlying repair invoices from building contractor.',
        severity: 'medium',
        suggestedVerification: 'Submit cure payment under formal reservation of rights and request itemized building ledger.'
      }
    ],
    sourceSnippets: [
      {
        id: 'lease-snip-1',
        section: 'Page 1, Notice to Cure',
        page: 1,
        originalText: 'YOU ARE HEREBY NOTIFIED that you are in default of Section 14 of the Lease Agreement dated June 1, 2023. You have 10 calendar days to cure.',
        verifiedFact: 'Formal 10-day cure period running from service date October 20, 2026.'
      }
    ],
    fileName: 'Notice_To_Cure_Suite402.pdf',
    fileSize: '820 KB'
  },
  {
    id: 'notice-fire-backflow',
    title: 'City Fire & Building Dept - Annual Backflow & Fire Sprinkler Certification Demand',
    issuingAuthority: 'City Dept. of Building Inspection & Fire Prevention Bureau',
    authorityType: 'Licensing & Municipal',
    category: 'Municipal & Licensing',
    referenceNumber: 'CITY-FPB-2026-00481',
    receivedDate: '2026-10-02',
    issueDate: '2026-09-28',
    deadlineDate: '2026-11-30',
    deadlineSource: 'Municipal Code Notice Section 3: "Annual certification must be submitted within 60 days of annual cycle expiration (November 30, 2026)."',
    deadlineType: 'calendar_days',
    urgency: 'upcoming',
    status: 'in_progress',
    confidenceScore: 99,
    plainLanguageSummary:
      'The city building and fire inspection bureau requires annual re-certification of your commercial kitchen backflow prevention assembly and fire sprinkler system riser test by a licensed C-16 contractor. Failure to file certified test forms by November 30 triggers a municipal code enforcement stop-work or revocation of business occupancy permit.',
    whyIssued: {
      trigger: 'Annual municipal life safety inspection cycle expiration.',
      officialRationale: 'Compliance with Municipal Health Code Chapter 12 and NFPA 25 standards.',
      businessRisk: 'City code enforcement citation ($500/day) and potential temporary suspension of Certificate of Occupancy.'
    },
    mandatoryActions: [
      {
        id: 'fire-m1',
        title: 'Schedule Certified Backflow Assembly Tester',
        deadline: '2026-11-15',
        description: 'Engage AWWA-certified plumbing technician to inspect double check detector backflow assembly.',
        completed: true
      },
      {
        id: 'fire-m2',
        title: 'Submit Form FPB-302 Test Report to City Portal',
        deadline: '2026-11-30',
        description: 'Upload signed tester certificate and pay $85 municipal filing administrative fee.',
        completed: false
      }
    ],
    suggestedPreparations: [
      {
        id: 'fire-s1',
        title: 'Confirm Kitchen Water Shutoff Window with Staff',
        timeframe: 'Before inspection',
        description: 'Backflow test requires 30-minute water main interruption; schedule before 7:00 AM operating hours.',
        completed: false
      }
    ],
    documentChecklist: [
      {
        id: 'fire-doc-1',
        name: 'City Fire Prevention Bureau Notice FPB-2026',
        description: 'Official notice with assembly serial number #BK-9021.',
        collected: true,
        mandatory: true,
        locationHint: 'Facilities binder'
      },
      {
        id: 'fire-doc-2',
        name: 'Prior Year (2025) Backflow Certification Form',
        description: 'Shows baseline pressure readings for comparison.',
        collected: true,
        mandatory: false,
        locationHint: 'Facilities binder'
      }
    ],
    legalCitations: [
      {
        code: 'Municipal Health Code § 12.04',
        title: 'Cross-Connection Control and Backflow Prevention',
        excerpt: 'All commercial food and chemical facilities shall maintain and test protective backflow assemblies annually.',
        plainMeaning: 'Mandatory annual municipal water safety inspection.'
      }
    ],
    missingOrUncertain: [
      {
        item: 'Whether Fire Sprinkler Riser Requires Separate Hydrostatic Test',
        reason: 'Notice mentions fire sprinkler certification, but 5-year internal pipe inspection is only due every five years.',
        severity: 'low',
        suggestedVerification: 'Ask contractor to verify tag date on main riser valve.'
      }
    ],
    sourceSnippets: [
      {
        id: 'fire-snip-1',
        section: 'Page 1, Notice Requirements',
        page: 1,
        originalText: 'ANNUAL RE-CERTIFICATION NOTICE. Device: Reduced Pressure Principle Backflow Preventer. Due Date: November 30, 2026.',
        verifiedFact: 'Annual recertification due by November 30, 2026.'
      }
    ],
    fileName: 'City_Backflow_Notice_2026.pdf',
    fileSize: '650 KB'
  },
  {
    id: 'notice-sos-delinquency',
    title: 'California Secretary of State - Biennial Statement of Information Warning',
    issuingAuthority: 'California Secretary of State (SOS), Business Programs Division',
    authorityType: 'State Tax & Revenue',
    category: 'Regulatory & Labor',
    referenceNumber: 'CA-SOS-ENTITY-C3982104',
    receivedDate: '2026-08-20',
    issueDate: '2026-08-15',
    deadlineDate: null,
    deadlineSource: 'Form SI-WARN: "Filing was due during your biennial period ending July 31, 2026. File immediately to avoid $250 penalty referral to Franchise Tax Board."',
    deadlineType: 'unspecified',
    urgency: 'not_identified',
    status: 'response_drafted',
    confidenceScore: 93,
    plainLanguageSummary:
      'The Secretary of State sent an informational warning that your LLC’s biennial Statement of Information (Form LLC-12) is past its statutory filing window. While no specific cutoff date is printed on the warning, California law instructs the SOS to assess a $250 late penalty through the Franchise Tax Board and suspend entity powers if filing is not completed promptly.',
    whyIssued: {
      trigger: 'Biennial statutory corporate reporting cycle expired without online submission.',
      officialRationale: 'Public record update requirement under California Corporations Code § 17702.09.',
      businessRisk: '$250 FTB delinquent penalty assessment and eventual administrative suspension of corporate charter (loss of right to sue or defend in state court).'
    },
    mandatoryActions: [
      {
        id: 'sos-m1',
        title: 'File Form LLC-12 Online via bizfileOnline.sos.ca.gov',
        deadline: 'Immediate (unspecified statutory cutoff)',
        description: 'Confirm current registered agent, LLC manager addresses, and pay $20 state filing fee online.',
        completed: true
      }
    ],
    suggestedPreparations: [
      {
        id: 'sos-s1',
        title: 'Check Franchise Tax Board Account for Penalty Assessment',
        timeframe: 'Within 10 days of filing',
        description: 'Verify MyFTB portal to confirm no $250 penalty lien has been transmitted.',
        completed: false
      }
    ],
    documentChecklist: [
      {
        id: 'sos-doc-1',
        name: 'Secretary of State Delinquency Warning Letter',
        description: 'Contains California Entity Number C3982104.',
        collected: true,
        mandatory: true,
        locationHint: 'Corporate records'
      }
    ],
    legalCitations: [
      {
        code: 'Cal. Corp. Code § 17702.09',
        title: 'Statement of Information by Limited Liability Company',
        excerpt: 'Every limited liability company shall file a statement of information with the Secretary of State biennially.',
        plainMeaning: 'Mandatory 2-year company information update.'
      }
    ],
    missingOrUncertain: [
      {
        item: 'Exact Date of FTB Penalty Referral',
        reason: 'The warning urges immediate filing but does not specify the precise calendar date on which the $250 fee is levied.',
        severity: 'high',
        suggestedVerification: 'File immediately online; portal processes confirmation in real-time.'
      }
    ],
    sourceSnippets: [
      {
        id: 'sos-snip-1',
        section: 'Page 1, Notice of Pending Penalty',
        page: 1,
        originalText: 'WARNING: Your entity has failed to file the required Statement of Information. Failure to file may result in a $250 penalty assessed by the Franchise Tax Board.',
        verifiedFact: 'Statement of information is delinquent; penalty referral to FTB is threatened.'
      }
    ],
    fileName: 'SOS_Delinquency_Warning_C3982104.pdf',
    fileSize: '410 KB'
  }
];
