// Setup
const contacts = [
  {
    firstName: "Akira",
    lastName: "Laine",
    number: "0543236543",
    likes: ["Pizza", "Coding", "Brownie Points"],
  },
  {
    firstName: "Harry",
    lastName: "Potter",
    number: "0994372684",
    likes: ["Hogwarts", "Magic", "Hagrid"],
  },
  {
    firstName: "Sherlock",
    lastName: "Holmes",
    number: "0487345643",
    likes: ["Intriguing Cases", "Violin"],
  },
  {
    firstName: "Kristian",
    lastName: "Vos",
    number: "unknown",
    likes: ["JavaScript", "Gaming", "Foxes"],
  },
];

function lookUpProfile(name, prop) {
  // Only change code below this line
  for(let i = 0; i < contacts.length; i++)
  {
      if(contacts[i].hasOwnProperty(prop) && contacts[i].firstName == name)
      {
        console.log(i);
        return contacts[i][prop];
      }
      else if(!contacts[i].hasOwnProperty(prop) && contacts[i].firstName == name){
        return "No such property";
      }
  }
  return "No such contact";
  // Only change code above this line
}

let a = lookUpProfile("Kristian", "lastName");
console.log(a);