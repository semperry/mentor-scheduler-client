const customData = {
  shiftTimes: [
    "8:00 am",
    "9:00 am",
    "10:00 am",
    "11:00 am",
    "12:00 pm",
    "1:00 pm",
    "2:00 pm",
    "3:00 pm",
    "4:00 pm",
    "5:00 pm",
    "6:00 pm",
    "7:00 pm",
    "8:00 pm",
    "9:00 pm",
    "10:00 pm"
  ],

  daysArr: [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ],

  sessionTimes: [
    "8:00am",
    "8:30am",
    "9:00am",
    "9:30am",
    "10:00am",
    "10:30am",
    "11:00am",
    "11:30am",
    "12:00pm",
    "12:30pm",
    "1:00pm",
    "1:30pm",
    "2:00pm",
    "2:30pm",
    "3:00pm",
    "3:30pm",
    "4:00pm",
    "4:30pm",
    "5:00pm",
    "5:30pm",
    "6:00pm",
    "6:30pm",
    "7:00pm",
    "7:30pm",
    "8:00pm",
    "8:30pm",
    "9:00pm",
    "9:30pm"
  ],

  percentSignFormatter: string => {
    return string
      .trim()
      .split(" ")
      .slice(0, 1)
      .join("");
  },

  nameCapitalizer: string => {
    return `${string[0].toUpperCase()}${string
      .split("")
      .splice(1)
      .join("")
      .toLowerCase()}`;
  },

  // Courtesy Chantay Riggs()
  returnsDataWithSortedTimes: data => {
    const returnNum = stringTime => {
      const final = [];
      const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      for (let i = 0; i < stringTime.length; i++) {
        if (stringTime[i] in nums) final.push(stringTime[i]);
      }
      if (final.length === 3 && stringTime.includes("p"))
        final[0] = Number(final[0]) + 12;
      else if (
        final.length === 4 &&
        stringTime.includes("p") &&
        final[0] != 1 &&
        final[1] != 2
      ) {
      }
      return Number(final.join(""));
    };
    let sortedList = [];
    data.map(session => {
      sortedList.push({
        time: returnNum(session.time),
        session: session
      });
    });
    sortedList.sort((a, b) => (a.time > b.time ? 1 : -1));
    let finalSortedArray = [];
    sortedList.map(bunch => {
      finalSortedArray.push(bunch.session);
    });
    return finalSortedArray;
  }
};

export default customData;
