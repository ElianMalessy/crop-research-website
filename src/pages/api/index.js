// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';

async function handler(req, res) {
  try {
    const data = await axios
      .all([
        axios.get('https://s3.amazonaws.com/seedsurvey/json/Tanzania_1.json'),
        axios.get('https://s3.amazonaws.com/seedsurvey/json/Tanzania_2.json'),
        axios.get('https://s3.amazonaws.com/seedsurvey/json/Nigeria_1.json'),
        axios.get('https://s3.amazonaws.com/seedsurvey/json/Nigeria_2.json'),
        axios.get('https://s3.amazonaws.com/seedsurvey/json/Ethiopia_1.json'),
        axios.get('https://s3.amazonaws.com/seedsurvey/json/Ethiopia_2.json')
      ])
      .then(
        axios.spread((data1, data2, data3, data4, data5, data6) => {
          res.json({
            Tanzania1: data1.data,
            Tanzania2: data2.data,
            Nigeria1: data3.data,
            Nigeria2: data4.data,
            Ethiopia1: data5.data,
            Ethiopia2: data6.data
          });
        })
      );
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  }
}

export default handler;
