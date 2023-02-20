const fid = (s) => (s.toString().length === 1 ? `0${s}` : s);

const getStorieNames = async () => {
  const records = [];
  const parser = fs.createReadStream(`resource/storie-names.csv`).pipe(
    parse({
      // CSV options if any
    })
  );
  parser.on("readable", function () {
    let record;
    while ((record = parser.read()) !== null) {
      // Work with each record
      records.push(record);
    }
  });
  await finished(parser);
  return records;
};

module.exports = {
  fid,
  getStorieNames,
};
