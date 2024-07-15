const express = require('express');
const yahooFinance = require('yahoo-finance2').default;
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://faisal:Fmusa975232@cluster0.v8kqp.mongodb.net/TaskManager?retryWrites=true&w=majority");
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

// Define a schema and model for the mutual_fund_nav collection
const mutualFundNavSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  nav: { type: String, required: true }
});

const MutualFundNav = mongoose.model('mutual_fund_nav', mutualFundNavSchema);


// Schema for Tata Ethical Fund
const tataFundNavSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  nav: { type: String, required: true }
});
const TataFundNav = mongoose.model('TataFundNav', tataFundNavSchema);


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'king975232@gmail.com',
    pass: 'ametkwrdyyqjoosp '
  }
});

const app = express();
const PORT = process.env.PORT || 5000;
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index'); // Renders index.ejs from views directory
});

app.get('/api/quote/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    const quote = await yahooFinance.quoteSummary(symbol, { modules: ['price'] });
    res.json(quote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const holdings = [
  { companyName: "Infosys Ltd.", quantity: "11.95 L", symbol: "INFY.NS" },
  { companyName: "Tata Consultancy Services Ltd.", quantity: "3.63 L", symbol: "TCS.NS" },
  { companyName: "Hindustan Unilever Ltd.", quantity: "4.39 L", symbol: "HINDUNILVR.NS" },
  { companyName: "Cummins India Ltd.", quantity: "2.62 L", symbol: "CUMMINSIND.NS" },
  { companyName: "Siemens Ltd.", quantity: "1.26 L", symbol: "SIEMENS.NS" },
  { companyName: "HCL Technologies Limited", quantity: "6.02 L", symbol: "HCLTECH.NS" },
  { companyName: "Ambuja Cements Ltd.", quantity: "10.80 L", symbol: "AMBUJACEM.NS" },
  { companyName: "Havells India Ltd.", quantity: "3.32 L", symbol: "HAVELLS.NS" },
  { companyName: "Carborundum Universal Ltd.", quantity: "3.88 L", symbol: "CARBORUNIV.NS" },
  { companyName: "Bharat Heavy Electricals Ltd.", quantity: "20.50 L", symbol: "BHEL.NS" },
  { companyName: "Tech Mahindra Ltd.", quantity: "3.85 L", symbol: "TECHM.NS" },
  { companyName: "Ultratech Cement Ltd.", quantity: "46.10 k", symbol: "ULTRACEMCO.NS" },
  { companyName: "Sumitomo Chemical India Private Ltd.", quantity: "8.97 L", symbol: "SUMICHEM.NS" },
  { companyName: "Voltas Limited", quantity: "3.00 L", symbol: "VOLTAS.NS" },
  { companyName: "Alkem Laboratories Ltd.", quantity: "84.27 k", symbol: "ALKEM.NS" },
  { companyName: "Godrej Consumer Products Ltd.", quantity: "3.05 L", symbol: "GODREJCP.NS" },
  { companyName: "Petronet LNG Ltd.", quantity: "12.93 L", symbol: "PETRONET.NS" },
  { companyName: "Emami Ltd.", quantity: "6.00 L", symbol: "EMAMILTD.NS" },
  { companyName: "Pi Industries Ltd.", quantity: "1.05 L", symbol: "PIIND.NS" },
  { companyName: "Dr. Reddys Laboratories Ltd.", quantity: "63.00 k", symbol: "DRREDDY.NS" },
  { companyName: "Aurobindo Pharma Ltd.", quantity: "3.00 L", symbol: "AUROPHARMA.NS" },
  { companyName: "KPIT Technologies Ltd.", quantity: "2.44 L", symbol: "KPITTECH.NS" },
  { companyName: "Sun Pharmaceutical Industries Ltd.", quantity: "2.42 L", symbol: "SUNPHARMA.NS" },
  { companyName: "Colgate - Palmolive (India) Limited", quantity: "1.32 L", symbol: "COLPAL.NS" },
  { companyName: "Cipla Ltd.", quantity: "2.35 L", symbol: "CIPLA.NS" },
  { companyName: "Ipca Laboratories Ltd.", quantity: "2.90 L", symbol: "IPCALAB.NS" },
  { companyName: "Tata Elxsi Ltd.", quantity: "48.00 k", symbol: "TATAELXSI.NS" },
  { companyName: "Supreme Industries Ltd.", quantity: "63.00 k", symbol: "SUPREMEIND.NS" },
  { companyName: "Page Industries Ltd.", quantity: "9.00 k", symbol: "PAGEIND.NS" },
  { companyName: "Motherson Sumi Wiring India Ltd.", quantity: "47.40 L", symbol: "MSUMI.NS" },
  { companyName: "Gujarat Gas Ltd.", quantity: "5.80 L", symbol: "GUJGASLTD.NS" },
  { companyName: "Linde India Ltd.", quantity: "36.65 k", symbol: "LINDEINDIA.NS" },
  { companyName: "Avenue Supermarts Ltd.", quantity: "73.00 k", symbol: "DMART.NS" },
  { companyName: "Indus Towers Ltd.", quantity: "9.00 L", symbol: "INDUSTOWER.NS" },
  { companyName: "SRF Ltd.", quantity: "1.39 L", symbol: "SRF.NS" },
  { companyName: "LTIMindtree Ltd.", quantity: "65.00 k", symbol: "LTIM.NS" },
  { companyName: "Cyient Ltd.", quantity: "1.76 L", symbol: "CYIENT.NS" },
  { companyName: "National Aluminium Co. Ltd.", quantity: "15.50 L", symbol: "NATIONALUM.NS" },
  { companyName: "ABB India Ltd.", quantity: "35.00 k", symbol: "ABB.NS" },
  { companyName: "Mphasis Ltd.", quantity: "1.20 L", symbol: "MPHASIS.NS" },
  { companyName: "Nestle India Ltd.", quantity: "1.15 L", symbol: "NESTLEIND.NS" },
  { companyName: "Tata Consumer Products Ltd.", quantity: "2.50 L", symbol: "TATACONSUM.NS" },
  { companyName: "J.b. Chemicals & Pharmaceuticals Ltd.", quantity: "1.47 L", symbol: "JBCHEPHARM.NS" },
  { companyName: "Schaeffler India Ltd.", quantity: "61.00 k", symbol: "SCHAEFFLER.NS" },
  { companyName: "Navin Flourine International Ltd.", quantity: "81.00 k", symbol: "NAVINFLUOR.NS" },
  { companyName: "Minda Industries Ltd.", quantity: "2.92 L", symbol: "UNOMINDA.NS" },
  { companyName: "MRF Ltd.", quantity: "1.95 k", symbol: "MRF.NS" },
  { companyName: "Gujarat State Petronet Ltd.", quantity: "8.40 L", symbol: "GSPL.NS" },
  { companyName: "K.P.R. Mill Ltd.", quantity: "3.11 L", symbol: "KPRMILL.NS" },
  { companyName: "Astral Ltd.", quantity: "1.14 L", symbol: "ASTRAL.NS" },
  { companyName: "Asian Paints (india) Ltd.", quantity: "82.00 k", symbol: "ASIANPAINT.NS" },
  { companyName: "3M India Ltd.", quantity: "6.50 k", symbol: "3MINDIA.NS" },
  { companyName: "Cera Sanitaryware Ltd.", quantity: "30.20 k", symbol: "CERA.NS" },
  { companyName: "Century Plyboards India Ltd.", quantity: "3.20 L", symbol: "CENTURYPLY.NS" },
  { companyName: "GAIL (India) Ltd.", quantity: "10.00 L", symbol: "GAIL.NS" },
  { companyName: "Castrol (india) Ltd.", quantity: "10.26 L", symbol: "CASTROLIND.NS" },
  { companyName: "Sundram Fasteners Ltd.", quantity: "1.62 L", symbol: "SUNDRMFAST.NS" },
  { companyName: "Sanofi India Ltd.", quantity: "22.30 k", symbol: "SANOFI.NS" },
  { companyName: "Relaxo Footwears Ltd.", quantity: "2.40 L", symbol: "RELAXO.NS" }
];

const taurusholdings = [
  { name: "Infosys Ltd.", quantity: "87.26k", symbol: "INFY.NS" },
  { name: "Reliance Industries Ltd.", quantity: "40.20k", symbol: "RELIANCE.NS" },
  { name: "Maruti Suzuki India Ltd.", quantity: "6.18k", symbol: "MARUTI.NS" },
  { name: "Computer Age Management Services Pvt Ltd.", quantity: "20.77k", symbol: "CAMS.NS" },
  { name: "HCL Technologies Limited", quantity: "51.39k", symbol: "HCLTECH.NS" },
  { name: "Hindustan Unilever Ltd.", quantity: "27.91k", symbol: "HINDUNILVR.NS" },
  { name: "Coal India Ltd.", quantity: "1.18L", symbol: "COALINDIA.NS" },
  { name: "GlaxoSmithKline Pharmaceuticals Ltd.", quantity: "21.57k", symbol: "GLAXO.NS" },
  { name: "Tata Consultancy Services Ltd.", quantity: "15.10k", symbol: "TCS.NS" },
  { name: "Bharat Electronics Ltd.", quantity: "1.82L", symbol: "BEL.NS" },
  { name: "Balkrishna Industries Ltd.", quantity: "14.95k", symbol: "BALKRISIND.NS" },
  { name: "Cipla Ltd.", quantity: "29.37k", symbol: "CIPLA.NS" },
  { name: "Tata Consumer Products Ltd.", quantity: "40.11k", symbol: "TATACONSUM.NS" },
  { name: "Sun Pharmaceutical Industries Ltd.", quantity: "25.00k", symbol: "SUNPHARMA.NS" },
  { name: "Narayana Hrudayalaya Ltd.", quantity: "29.77k", symbol: "NH.NS" },
  { name: "Petronet LNG Ltd.", quantity: "1.18L", symbol: "PETRONET.NS" },
  { name: "Pidilite Industries Ltd.", quantity: "11.81k", symbol: "PIDILITIND.NS" },
  { name: "LTIMindtree Ltd.", quantity: "7.43k", symbol: "LTIM.NS" },
  { name: "Astral Ltd.", quantity: "16.31k", symbol: "ASTRAL.NS" },
  { name: "Mphasis Ltd.", quantity: "14.69k", symbol: "MPHASIS.NS" },
  { name: "DLF Ltd.", quantity: "40.47k", symbol: "DLF.NS" },
  { name: "Varun Beverages Ltd.", quantity: "22.63k", symbol: "VBL.NS" },
  { name: "GAIL (India) Ltd.", quantity: "1.55L", symbol: "GAIL.NS" },
  { name: "Indraprastha Gas Ltd.", quantity: "71.28k", symbol: "IGL.NS" },
  { name: "Abbott India Ltd.", quantity: "1.20k", symbol: "ABBOTINDIA.NS" },
  { name: "NMDC LTD", quantity: "1.15L", symbol: "NMDC.NS" },
  { name: "Happiest Minds Technologies Ltd.", quantity: "37.96k", symbol: "HAPPSTMNDS.NS" },
  { name: "Honeywell Automation India Ltd.", quantity: "580.00", symbol: "HONAUT.NS" },
  { name: "Tata Chemicals Ltd.", quantity: "27.42k", symbol: "TATACHEM.NS" },
  { name: "Tata Communications Ltd.", quantity: "15.89k", symbol: "TATACOMM.NS" },
  { name: "Whirlpool Of India Ltd.", quantity: "18.52k", symbol: "WHIRLPOOL.NS" },
  { name: "Divis Laboratories Ltd.", quantity: "5.53k", symbol: "DIVISLAB.NS" },
  { name: "Tech Mahindra Ltd.", quantity: "19.21k", symbol: "TECHM.NS" },
  { name: "Symphony Ltd.", quantity: "21.74k", symbol: "SYMPHONY.NS" },
  { name: "KPIT Technologies Ltd.", quantity: "16.02k", symbol: "KPITTECH.NS" },
  { name: "AIA Engineering Ltd.", quantity: "6.14k", symbol: "AIAENG.NS" },
  { name: "Zydus Lifesciences Ltd.", quantity: "22.28k", symbol: "ZYDUSLIFE.NS" },
  { name: "V.I.P. Industries Ltd", quantity: "44.01k", symbol: "VIPIND.NS" },
  { name: "Motherson Sumi Wiring India Ltd.", quantity: "3.03L", symbol: "MSUMI.NS" },
  { name: "Nestle India Ltd.", quantity: "8.37k", symbol: "NESTLEIND.NS" },
  { name: "Associated Cement Companies Ltd.", quantity: "7.62k", symbol: "ACC.NS" },
  { name: "Dr. Reddys Laboratories Ltd.", quantity: "3.05k", symbol: "DRREDDY.NS" },
  { name: "Asian Paints (india) Ltd.", quantity: "5.93k", symbol: "ASIANPAINT.NS" },
  { name: "PCBL Ltd.", quantity: "68.38k", symbol: "PCBL.NS" },
  { name: "Vardhman Textiles Ltd.", quantity: "34.46k", symbol: "VTL.NS" },
  { name: "Pi Industries Ltd.", quantity: "3.56k", symbol: "PIIND.NS" },
  { name: "Firstsource Solutions Ltd.", quantity: "67.88k", symbol: "FSL.NS" },
  { name: "NATCO Pharma Ltd.", quantity: "8.88k", symbol: "NATCOPHARM.NS" },
  { name: "Varroc Engineering Ltd.", quantity: "14.57k", symbol: "VARROC.NS" },
  { name: "Gujarat Pipavav Port Ltd.", quantity: "31.21k", symbol: "GPPL.NS" },
  { name: "Bharat Dynamics Ltd.", quantity: "3.86k", symbol: "BDL.NS" }
];


async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.get('/holdings', async (req, res) => {
  let totalMarketPrice = 0;
  let totalMarketChange = 0;
  let totalMarketChangePercent = 0;
  const prices = [];

  let totalValue = 0;

  for (let i = 0; i < holdings.length; i++) {
    console.log(holdings[i].companyName);
    const { symbol, quantity } = holdings[i];
    const quantityNum = parseFloat(quantity) * (quantity.endsWith('L') ? 100000 : 1000); // Convert quantity to number

    try {
      const quote = await yahooFinance.quoteSummary(symbol, { modules: ['price'] });
      const price = quote.price.regularMarketPrice;
      const marketChange = quote.price.regularMarketChange;
      const marketChangePercent = quote.price.regularMarketChangePercent;

      totalValue += price * quantityNum;
      totalMarketChange += marketChange * quantityNum;
      totalMarketChangePercent += marketChangePercent; // Summing percentage change * quantity

      await delay(100);
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
    }

    console.log(`Current total value: ${totalValue}`);
  }

  console.log(`Final total value: ${totalValue}`);
  console.log(`Total market change: ${totalMarketChange}`);
  console.log(`Total market change percentage: ${totalMarketChangePercent}`);

  res.render('holdings', {
    totalValue: totalValue,
    totalMarketChange: totalMarketChange,
    totalMarketChangePercent: totalMarketChangePercent,
  });
});



app.get('/tata', (req, res) => {
  const mf = 'Tata Ethical Fund';
  res.render('holdings', { holdings, mf });
});

app.get('/taurus', (req, res) => {
  const mf = 'Taurus Ethical Fund';
  res.render('taurus', { taurusholdings, mf });
});

app.get('/api/holding/:symbol', async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const quote = await yahooFinance.quoteSummary(symbol, { modules: ['price'] });
    const price = quote.price.regularMarketPrice;
    const marketChange = quote.price.regularMarketChange;
    const marketChangePercent = quote.price.regularMarketChangePercent;

    res.json({
      symbol,
      price,
      marketChange,
      marketChangePercent,
    });
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});


app.get('/cronjob', async (req, res) => {
  const urls = {
    taurus: 'https://api.mfapi.in/mf/111787/latest',
    tata: 'https://api.mfapi.in/mf/119172/latest'
  };

  try {
    // Fetch data for both funds
    const [taurusResponse, tataResponse] = await Promise.all([
      axios.get(urls.taurus),
      axios.get(urls.tata)
    ]);

    const today = new Date();
    const todayStr = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

    // Check Taurus Mutual Fund
    if (taurusResponse.data.status === 'SUCCESS' && taurusResponse.data.data && taurusResponse.data.data.length > 0) {
      const navDate = taurusResponse.data.data[0].date;

      if (navDate === todayStr) {
        const existingRecord = await MutualFundNav.findOne({ date: todayStr });

        if (!existingRecord) {
          const mailOptions = {
            from: 'king975232@gmail.com',
            to: 'king975232@gmail.com',
            subject: 'Taurus Mutual Fund NAV Updated',
            text: `The NAV data has been updated for today (${todayStr}). The new NAV is ${taurusResponse.data.data[0].nav}.`
          };

          await transporter.sendMail(mailOptions);

          const newRecord = new MutualFundNav({
            date: todayStr,
            nav: taurusResponse.data.data[0].nav
          });

          await newRecord.save();
          console.log('Taurus email sent successfully');
        } else {
          console.log('Taurus email already sent for today');
        }
      } else {
        console.log('Taurus NAV data is not updated for today');
      }
    } else {
      console.log('Failed to fetch Taurus NAV data');
    }

    // Check Tata Ethical Fund
    if (tataResponse.data.status === 'SUCCESS' && tataResponse.data.data && tataResponse.data.data.length > 0) {
      const navDate = tataResponse.data.data[0].date;

      if (navDate === todayStr) {
        const existingRecord = await TataFundNav.findOne({ date: todayStr });

        if (!existingRecord) {
          const mailOptions = {
            from: 'king975232@gmail.com',
            to: 'king975232@gmail.com',
            subject: 'Tata Ethical Fund NAV Updated',
            text: `The NAV data has been updated for today (${todayStr}). The new NAV is ${tataResponse.data.data[0].nav}.`
          };

          await transporter.sendMail(mailOptions);

          const newRecord = new TataFundNav({
            date: todayStr,
            nav: tataResponse.data.data[0].nav
          });

          await newRecord.save();
          console.log('Tata email sent successfully');
        } else {
          console.log('Tata email already sent for today');
        }
      } else {
        console.log('Tata NAV data is not updated for today');
      }
    } else {
      console.log('Failed to fetch Tata NAV data');
    }

    return res.status(200).send('Cron job executed successfully');
  } catch (error) {
    console.error('Error checking NAV data:', error);
    return res.status(500).send('Error checking NAV data');
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
