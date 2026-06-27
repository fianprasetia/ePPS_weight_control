# Issue: Implement Browser Print Preview for Internal FFB Weighbridge

## Overview

Implement Browser Print feature for Internal FFB (TBS Inti) module.

The print process must use browser native printing and support Epson LQ-310 with Continuous Form Paper size 1/2 A4 (148mm x 210mm).

Before printing, the user must be able to review the ticket information inside a preview modal.

---

## Objective

Create a print workflow for Internal FFB transaction after data is successfully saved.

Flow:

```text
Save & Print
    ↓
Save Data
    ↓
Show Preview Modal
    ↓
Print Button
    ↓
window.open('/print-ticket/:ticketNo')
    ↓
window.print()
```

---

## Requirements

### Print Method

Use Browser Print.

Do not use:

* PDF generation
* ESC/POS
* QZ Tray
* Third-party printing library

Use:

```javascript
window.open('/print-ticket/' + ticketNo);
```

and

```javascript
window.print();
```

---

## Save Print Flow

### Function

Create or update:

```javascript
savePrint()
```

### Flow

1. Validate form.
2. Save weighbridge data.
3. Retrieve generated ticket number.
4. Open preview modal.
5. Display ticket information inside modal.
6. User clicks Print.
7. Open print page.
8. Automatically trigger browser print dialog.
9. User prints ticket.

---

## Preview Modal

### Modal ID

```html
modalInternalFFB
```

### Buttons

#### Print

```html
<button id="btnPrintTicket">
    Print
</button>
```

Action:

```javascript
window.open(
    '/print-ticket/' + ticketNo,
    '_blank'
);
```

---

#### Cancel

```html
<button id="btnCancelPrint">
    Cancel
</button>
```

Action:

```javascript
Close modal
```

---

## Backend Endpoint

Create new route:

```http
GET /print-ticket/:ticketNo
```

Purpose:

Render printable weighbridge ticket.

---

## Data Source

### Company Information

Table:

```text
mll_weight_control
```

Field:

```text
name_company
```

Purpose:

Display as ticket header.

Example:

```text
PT SIA PLANTATION
```

---

### Ticket Information

Table:

```text
mll_weigh_bridge
```

Retrieve the following fields:

```text
ticket_no
estate_code
division_code
unit_type
entry_time
exit_time
gross_weight
tare_weight
bruto
netto
driver_name
spb_no
vehicle_no
year_plant
created_by
note
```

---

## Preview Modal Layout

Display the following information:

```text
Company Name

Ticket No
SPB No
Vehicle No
Driver
Estate
Division
Unit Type
Year Plant

Entry Time
Exit Time

Gross Weight
Tare Weight
Bruto
Netto

Note
Created By
```

---

## Print Page

### File

Create new EJS template:

```text
views/internal_ffb/print-ticket.ejs
```

---

### Auto Print

After page load:

```javascript
window.onload = function () {
    window.print();
};
```

---

## Print Layout

### Header

Display:

```text
PT SIA PLANTATION
TIKET TIMBANG TBS INTI
```

Company name comes from:

```text
mll_weight_control.name_company
```

---

### Body

Display:

```text
Ticket No
SPB No
Vehicle No
Driver

Estate
Division
Unit Type
Year Plant

Entry Time
Exit Time

Gross Weight
Tare Weight

Bruto
Netto

Note

Created By
```

---

## Paper Configuration

Printer:

```text
Epson LQ-310
```

Paper:

```text
Continuous Form
1/2 A4
148mm x 210mm
```

---

## Print CSS

Create print stylesheet.

Requirements:

```css
@page {
    size: 148mm 210mm;
    margin: 5mm;
}
```

```css
body {
    width: 148mm;
    font-family: Consolas, monospace;
}
```

---

## Acceptance Criteria

### AC-01

User can click Save & Print.

### AC-02

Data is saved successfully.

### AC-03

Preview modal appears after save.

### AC-04

Preview modal displays ticket information correctly.

### AC-05

Print button opens print page.

### AC-06

Print page automatically triggers browser print dialog.

### AC-07

Company name is displayed from:

```text
mll_weight_control.name_company
```

### AC-08

Ticket data is retrieved from:

```text
mll_weigh_bridge
```

### AC-09

Layout fits Continuous Form 1/2 A4 (148mm x 210mm).

### AC-10

Print output is compatible with Epson LQ-310.

---

## Notes

* Use existing Bootstrap 5 modal styling.
* Use existing Internal FFB module structure.
* Keep implementation simple and maintainable.
* No external printing libraries are required.
* Browser print must be the only printing mechanism.
* Preview modal must always appear before printing.
* Print page should be accessible for future reprint functionality.

```
GET /print-ticket/:ticketNo
```
