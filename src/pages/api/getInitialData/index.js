import axios from 'axios';

async function handler(req, res) {
  try {
    const data = await axios
      .all([
        axios.get('https://s3.amazonaws.com/seedsurvey/json/Tanzania_0.json'),
        axios.get('https://s3.amazonaws.com/seedsurvey/json/Nigeria_0.json'),
        axios.get('https://s3.amazonaws.com/seedsurvey/json/Ethiopia_0.json')
      ])
      .then(
        axios.spread((data1, data2, data3) => {
          res.json({
            Tanzania0: data1.data,
            Nigeria0: data2.data,
            Ethiopia0: data3.data
          });
        })
      );
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  }
}

export default handler;
