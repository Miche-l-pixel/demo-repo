# Google Sheets Setup Guide — Volunteer Form

Follow these steps to connect the volunteer form to your Google Sheet.

---

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a **new blank spreadsheet**
2. Name it: `Tiyasa Volunteers`
3. In **Row 1**, add these column headers (exactly as shown):

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Timestamp | Name | Phone | Email | City | Help Type | Weekends | Message |

4. Save the sheet

---

## Step 2: Open Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete any existing code in the editor
3. Paste the following code:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp || new Date().toLocaleString(),
    data.name || '',
    data.phone || '',
    data.email || '',
    data.city || '',
    data.helpType || '',
    data.weekends || '',
    data.message || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Click **Save** (Ctrl+S) and name the project: `Volunteer Form Handler`

---

## Step 3: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ next to "Select type" → choose **Web app**
3. Set:
   - **Description**: Volunteer form handler
   - **Execute as**: Me
   - **Who has access**: **Anyone**
4. Click **Deploy**
5. Click **Authorize access** → select your Google account → click **Allow**
6. **Copy the Web app URL** (it looks like: `https://script.google.com/macros/s/AKfyc.../exec`)

---

## Step 4: Add the URL to Your Website

1. Open `js/main.js`
2. Find this line near the top of the Volunteer Modal section:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
   ```
3. Replace `YOUR_GOOGLE_SCRIPT_URL_HERE` with your copied URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfyc.../exec';
   ```
4. Save, commit, and push

---

## Step 5: Test It

1. Open your website and click the **Volunteer** button
2. Fill in the form and submit
3. Check your Google Sheet — the data should appear in a new row

---

## Transferring to Client

When ready to hand over to your client:
1. Open the Google Sheet → **Share** → Add client's email as **Owner**
2. Client accepts ownership
3. **No code changes needed** — the same Apps Script URL continues to work

---

## Troubleshooting

| Issue | Solution |
|---|---|
| Data not appearing | Make sure the URL in `main.js` is correct and you deployed as **Anyone** |
| Authorization error | Re-deploy the Apps Script and re-authorize |
| CORS error in console | This is expected with `no-cors` mode — the data still submits correctly |
