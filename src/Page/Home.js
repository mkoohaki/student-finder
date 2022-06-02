import { Component } from "react";
import axios from "axios";
import "../style/style.css";

// Get numbers as an array
// Calculate average
// Return a average as a number
function getAverage(grades) {
  let summary = 0;
  for (let grade of grades) {
    summary += parseInt(grade);
  }
  return summary / grades.length;
}

// Get array of students as objects
// Set "average" number for all students with calling getAverag()
// Return array of students as objects
function getAllAveragefor(students) {
  for (let student of students) {
    let average = getAverage(student.grades);
    student["average"] = average;
  }
  return students;
}

// Get array of students as objects
// Set "gradeVisible" for all students to false boolean
// Return array of students as objects
function gradeVisibility(students) {
  for (let student of students) {
    student["gradeVisible"] = false;
  }
  return students;
}

// Get array of students as objects, a String, and a number
// Set "tags" for specific student
// Return array of students as objects
function addTags(students, tag, key) {
  if (students[key].tags == null) {
    students[key]["tags"] = [];
  }
  if (!students[key].tags.includes(tag)) {
    students[key].tags.push(tag);
  }
  return students;
}

// Get array of tags and a number
// Set "tags" for the specific student to ""
// Return array of tags
function resetTag(tags, key) {
  let newTags = tags;
  let newTag = newTags[key];

  newTag = "";
  newTags[key] = newTag;
  return newTags;
}

// Get array of students as objects and Strings
// Set a new arraye of students with filterin according to two Strings
// Return new array of students as objects
function displayList(students, name, tag) {
  if (name !== "" && tag !== "") {
    let newStudents = students.filter(
      (student) =>
        (student.firstName.toLowerCase().indexOf(name.toLowerCase()) === 0 ||
          student.lastName.toLowerCase().indexOf(name.toLowerCase()) === 0 ||
          (
            student.firstName.toLowerCase() +
            " " +
            student.lastName.toLowerCase()
          ).indexOf(name) === 0) &&
        student.tags &&
        student.tags.includes(tag)
    );
    return newStudents;
  } else if (name !== "") {
    let newStudents = students.filter(
      (student) =>
        student.firstName.toLowerCase().indexOf(name.toLowerCase()) === 0 ||
        student.lastName.toLowerCase().indexOf(name.toLowerCase()) === 0 ||
        (
          student.firstName.toLowerCase() +
          " " +
          student.lastName.toLowerCase()
        ).indexOf(name) === 0
    );
    return newStudents;
  } else if (tag !== "") {
    let newStudents = students.filter(
      (student) => student.tags && student.tags.includes(tag)
    );
    return newStudents;
  }

  return students;
}

// Class
export default class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      permanentStudents: [],
      students: [],
      name: "",
      tags: [],
      searchTag: "",
    };

    this.onChange = this.onChange.bind(this);
  }

  // Get objects as an array from an api
  // Set state students after calling getAllAveragefor() and gradeVisibility()
  componentDidMount() {
    axios.get("https://api.hatchways.io/assessment/students").then((res) => {
      let newStudents = getAllAveragefor(res.data.students);
      newStudents = gradeVisibility(newStudents);
      this.setState({
        students: newStudents,
        permanentStudents: newStudents,
      });
    });
  }

  // Get any change in inputs of name and searchTag
  // Set name and searchTag
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  // Get any change in inputs of tag and the row
  // Set name and searchTag
  onChangeTag(e, key) {
    let oldTags = [...this.state.tags];
    let oldTag = { ...oldTags[key] };
    oldTag = e.target.value;
    oldTags[key] = oldTag;
    this.setState({
      tags: oldTags,
    });
  }

  onOpen(key) {
    let state = this.state.students;
    state[key].gradeVisible = !state[key].gradeVisible;
    this.setState({ state });

    console.log(this.state.students);
  }

  onSubmit(e, key) {
    e.preventDefault();

    this.setState({
      students: addTags(this.state.students, this.state.tags[key], key),
      tags: resetTag(this.state.tags, key),
    });
  }

  render() {
    return (
      <main>
        <input
          type='text'
          className='input'
          placeholder='Sarch by name'
          name='name'
          value={this.state.name}
          onChange={this.onChange}
        />
        <input
          type='text'
          className='input'
          placeholder='Sarch by tag'
          name='searchTag'
          value={this.state.searchTag}
          onChange={this.onChange}
        />
        {displayList(
          this.state.students,
          this.state.name,
          this.state.searchTag
        ).map((student, i) => (
          <div key={i}>
            <div className='div' id='div1'>
              <img
                src={student.pic}
                alt={`${student.firstName} ${student.lastName}`}
              />
            </div>
            <div className='div' id='div2'>
              <h1>
                {`${student.firstName.toUpperCase()} ${student.lastName.toUpperCase()}`}
              </h1>
              <p>Email: {student.email}</p>
              <p>Company: {student.company}</p>
              <p>Skill: {student.skill}</p>
              <p>Average: {student.average}%</p>
            </div>
            <div className='div' id='div3'>
              {student.gradeVisible ? (
                <button id={`button${i}`} onClick={() => this.onOpen(i)}>
                  -
                </button>
              ) : (
                <button id={`button${i}`} onClick={() => this.onOpen(i)}>
                  +
                </button>
              )}
            </div>
            <div id='gradeDiv'>
              {student.gradeVisible ? (
                <ul>
                  {student.grades.map((grade, i) => (
                    <li key={i}>
                      Test {i + 1}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{grade}%
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div className='tagDiv'>
              {student.tags ? (
                <div>
                  {student.tags.map((tag, i) => (
                    <p key={i} className='pTag'>
                      {tag}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
            <div>
              <form onSubmit={(e) => this.onSubmit(e, i)}>
                <input
                  id='tagInput'
                  placeholder='Add a tag'
                  name='tag'
                  value={this.state.tags[i]}
                  onChange={(e) => this.onChangeTag(e, i)}
                />
                <input type='submit' hidden />
              </form>
            </div>
          </div>
        ))}
      </main>
    );
  }
}