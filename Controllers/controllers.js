const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Facultysignup = require('../Models/FacultySignup');
const AddTaskbyfac = require('../Models/AddTask');
const UploadassByfac = require('../Models/AssByFac');
const Notesbyfac = require('../Models/AddNotes');
const Notificationsbyfac = require('../Models/AddNotifications');
const NotificationsforFaculty = require('../Models/NotificationsforFaculty');
const AddStudentbyfac = require('../Models/StudentSchema');
const AddStudentRepotandComments = require('../Models/AddStudentReport');
const SubmitAssBYStudent = require("../Models/SubmitAss");
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const uniqid = require('uniqid');
const Subjectdetails = require('../Models/Coursedetails');
const Studenttaskprogress = require("../Models/StudentProgress");
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const ComplaintorFeedback = require("../Models/FeedbackorComplaint");
const AdminSignup = require("../Models/Adminsignup");
const Sucpeciousadmin = require("../Models/SucpeciousAdmin");
const IndividualNotifications = require('../Models/IndividualNotifications');
const Replyindividualmessage = require('../Models/ReplyIndividualnotifications');
const RequestToincoorect = require("../Models/Incorrectdetails");
const path = require("path");
const csv = require("@fast-csv/parse");
const Chat_user = require("../Models/ChatuserSchema");
const Conversation = require("../Models/ConversationsLog");



const createToken = (_id) => {
    return token = jwt.sign({ _id }, 'dsgcgdgcuggyfgewfgefgewc', { expiresIn: '3h' });
}

exports.FacultySignupfunc = async (req, res) => { // Signup Faculty.


    try {
        const file = req.file.filename;

        const { facultyname, facultyphonenumber, facultysubjectname, facultyemail, facultypassword, isfacultymentor } = req.body;

        // Check if the username already exists
        const existingUser = await Facultysignup.findOne({ facultyemail });
        if (existingUser) {
            return res.status(400).json({ message: 'Faculty already exists' });
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(facultypassword, 10);

        // Create a new user
        const newFacultyRegisteration = new Facultysignup({
            facultyname,
            facultyphonenumber,
            facultysubjectname,
            facultyemail,
            isfacultymentor,
            facultyprofileimg: file,
            facultypassword: hashedPassword,
        });

        // Save the user to the database
        await newFacultyRegisteration.save();
        const token = createToken(newFacultyRegisteration._id)
        // Respond with success message
        res.status(201);
        res.status(201).json({ message: 'Registration successful', newFacultyRegisteration, token });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err });
    }
}

exports.FacultySignINfunc = async (req, res) => { // SignIN Faculty.

    try {
        const { facultyemail, facultypassword } = req.body;

        // Find the user by username
        const Facultyuser = await Facultysignup.findOne({ facultyemail });

        // If the user doesn't exist
        if (!Facultyuser) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(facultypassword, Facultyuser.facultypassword);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Wrong credentials' });
        }

        // Create a JWT token for the user
        const token = createToken(Facultyuser._id)

        // Respond with the token
        res.status(200).json({ token, facultyemail, Facultyuser });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err });
    }
}

exports.IndividualFacultyDetail = async (req, res) => {
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        const Individualfacultydetails = await Facultysignup.findOne({ _id: user_id });
        res.status(200).json(Individualfacultydetails); // for postman app
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.Edtifacultyfunc = async (req, res) => { // Edit Faculty.

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }

    try {


        const { facultyname, facultyphonenumber, facultysubjectname, isfacultymentor } = req.body;


        // Check if the username already exists
        const existingUser = await Facultysignup.findOne({ _id: user_id });
        if (!existingUser) {
            return res.status(400).json({ message: 'Faculty not exists' });
        }
        var file;
        if (req.file) {
            file = req.file.filename;
        } else {
            file = existingUser.facultyprofileimg;
        }
        // Create a new user
        const oldFacultyedit = await Facultysignup.findByIdAndUpdate(
            { _id: user_id },
            { facultyname, facultyphonenumber, facultysubjectname, isfacultymentor, facultyprofileimg: file }
        );

        // Save the user to the database
        await oldFacultyedit.save();
        // Create a JWT token for the user
        const token = createToken(existingUser._id);

        // Respond with success message
        res.status(200);
        res.status(200).json({ message: 'Edited successful', token, oldFacultyedit });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err });
    }
}

exports.AddTaskByFaculty = async (req, res) => { // Add Task By Individual Faculty.

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        const { topicname, subtopics, startdate, enddate, status, progress } = req.body;

        // Find the user by username
        const Facultyuser = await Facultysignup.findOne({ _id: user_id });

        // If the user doesn't exist
        if (!Facultyuser) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Add New Task
        const AddTaskByFaculty = new AddTaskbyfac({
            topicname, subtopics, startdate, enddate, status, progress, user_id
        });

        // Save the Task to the database
        await AddTaskByFaculty.save();

        // Respond with the token
        res.status(200).json({ AddTaskByFaculty, user_id });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err });
    }
}

exports.Getalltasksbyfaculty = async (req, res) => {// Get all Task's

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        const Individualfacultytasks = await AddTaskbyfac.find({ user_id });
        res.status(200).json(Individualfacultytasks); // for postman app
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.Deletespecifictask = async (req, res) => { // Delete Specific/completed task.

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    const { id } = req.params;
    try {
        const DeleteIndividualfacultytasks = await AddTaskbyfac.findByIdAndDelete({ _id: id });
        res.status(200).json({ DeleteIndividualfacultytasks, user_id }); // for postman app
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.EditFacultytaskprogress = async (req, res) => { // Edit Faculty Task Progress only.

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    const { id } = req.params;
    try {
        const { val } = req.body;
        // Edit
        const Editedtask = await AddTaskbyfac.findByIdAndUpdate(
            { _id: id },
            { progress: val }
        );

        // Save the user to the database
        await Editedtask.save();
        // Respond with success message
        res.status(200);
        res.status(200).json({ message: 'Edited successful', Editedtask });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err });
    }
}

exports.UplaodAssbyFac = async (req, res) => { // Upload Assignment By faculty
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        // Find the user by username
        const Facultyuser = await Facultysignup.findOne({ _id: user_id });

        // If the user doesn't exist
        if (!Facultyuser) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const file = req.file.filename;
        const { assinc } = req.body;
        const uploadass = new UploadassByfac({
            assbyfaculty: file,
            assinc,
            user_id
        })
        await uploadass.save(); // Uplaod ass in DB
        // Respond with success message
        res.status(201);
        res.status(201).json({ message: 'Assignment successful', uploadass, user_id });

    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err });
    }
}

exports.UplaodNotesbyFac = async (req, res) => { // Upload Notes By faculty
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        // Find the user by username
        const Facultyuser = await Facultysignup.findOne({ _id: user_id });

        // If the user doesn't exist
        if (!Facultyuser) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const file = req.file.filename;
        const uploadnotes = new Notesbyfac({
            notesbyfaculty: file,
            user_id
        })
        await uploadnotes.save(); // Uplaod ass in DB
        // Respond with success message
        res.status(201);
        res.status(201).json({ message: 'Notes successful', uploadnotes, user_id });

    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err });
    }
}


exports.AddstudentByfaculty = async (req, res) => {//Add student by faculty

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        const { firstname, middlename, lastname, gender, dob, fathername, mothername, phonenumber, locality, emailid, password, coursename, coursetype, sessionyear, rollnumber, enrollementnumber, courseyears, sem1, sem2, sem3, sem4, sem5, sem6, sem7, sem8, mentorname, mentorphnumber, mentoremailid, studentstatus } = req.body;
        // Find the user by username
        const Facultyuser = await Facultysignup.findOne({ _id: user_id });

        // If the user doesn't exist
        if (!Facultyuser) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const mentordetails = await Facultysignup.findOne({ facultyemail: mentoremailid });
        if (!mentordetails) {
            return res.status(400).json({ message: 'Mentor Name/Email ID incorrect' });
        } else if (mentordetails.isfacultymentor === 'no') {
            return res.status(400).json({ message: 'This is not a mentor in our Database!' });
        } else {
            // Hash the password before saving it to the database
            const hashedPassword = await bcrypt.hash(password, 10);
            // Add New Student
            const AddStudent = new AddStudentbyfac({
                firstname, middlename, lastname, gender, dob, fathername, mothername, phonenumber, locality, emailid, password: hashedPassword, coursename, coursetype, sessionyear, rollnumber, enrollementnumber, courseyears, sem1, sem2, sem3, sem4, sem5, sem6, sem7, sem8, mentorname, mentorphnumber, mentoremailid,
                mentordata: mentordetails._id, user_id, studentstatus
            });

            // Save the Student to the database
            await AddStudent.save();
            res.status(200).json({ AddStudent, user_id });
        }

    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err });
    }

}

exports.GetstudentByfaculty = async (req, res) => {// Get Student by faculty

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {

        const AllStudent = await AddStudentbyfac.find();
        return res.status(200).json({ message: 'All Students', AllStudent, user_id })
    } catch (err) {
        return res.status(500).json(err)
    }
}

exports.getstudentdetails_Fortoggle = async (req, res) => { // Get Student but with toogle button

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        const { id } = req.params;
        // console.log(id);
        const IndividualStudent = await AddStudentbyfac.find({ _id: id });
        return res.status(200).json({ message: 'IndividualStudent Students', IndividualStudent, user_id })
    } catch (err) {
        return res.status(500).json(err)
    }

}

exports.ChanegStatusByFac = async (req, res) => { // Change the status of student Active/Block.
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        const { id } = req.params;
        // console.log(id);
        const StudentDetails = await AddStudentbyfac.findById({ _id: id });
        if (!StudentDetails) {
            return res.status(400).json({ message: "Student Not Found" });
        } else {
            var changeStatus;
            if (StudentDetails.studentstatus === 'active') {
                changeStatus = 'blocked';
            } else {
                changeStatus = 'active';
            }
            const editstudentstatus = await AddStudentbyfac.findByIdAndUpdate({ _id: id },
                { studentstatus: changeStatus }
            );
            await editstudentstatus.save();
            return res.status(200).json({ message: 'Status Changed', editstudentstatus, changeStatus })
        }

    } catch (err) {
        return res.status(500).json({ message: err })
    }

}

exports.AddStudentReports = async (req, res) => { // Add Report's & Comment's
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {

        const { id } = req.params;

        const { studentattpercentage, studenttestresults, studentassmarks, comments, severity } = req.body;

        const StudentDetails = await AddStudentbyfac.findById({ _id: id });

        if (!StudentDetails) {
            return res.status(400).json({ message: "Student Not Found" });
        } else {

            const SavedReportandComments = new AddStudentRepotandComments({
                studentattpercentage, studenttestresults, studentassmarks, studentdata: id, user_id: user_id, comments, severity

            });
            await SavedReportandComments.save();
            return res.status(201).json({ message: 'Given Student repot added', SavedReportandComments })
        }
    } catch (err) {
        return res.status(500).json(err);
    }

}

exports.Delete_student = async (req, res) => { // Delete student
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {

        const { id } = req.params;

        const StudentDetails = await AddStudentbyfac.findById({ _id: id });
        if (!StudentDetails) {
            return res.status(400).json({ message: "Student Not Found" });
        } else {

            const deletedstudent = await AddStudentbyfac.findByIdAndDelete({ _id: id });
            return res.status(200).json({ message: 'Given Student is deleted', deletedstudent })
        }
    } catch (err) {
        return res.status(500).json({ message: err });
    }

}

exports.EditStudent_Details = async (req, res) => { // Edit student details

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {

        const { id } = req.params;
        const { firstname, middlename, lastname, fathername, mothername, phonenumber, sessionyear, mentorname, mentorphnumber, mentoremailid } = req.body;

        const StudentDetails = await AddStudentbyfac.findById({ _id: id });
        if (!StudentDetails) {
            return res.status(400).json({ message: "Student Not Found" });
        } else {

            const mentordetails = await Facultysignup.findOne({ facultyemail: mentoremailid });
            if (mentoremailid !== "") {
                if (!mentordetails) {
                    return res.status(403).json({ message: 'Mentor Email ID incorrect' });
                } else if (mentordetails.isfacultymentor === 'no') {
                    return res.status(404).json({ message: 'This is not a mentor in our Database!' });
                }
            }

            const editedstudentdata = await AddStudentbyfac.findByIdAndUpdate({ _id: id },
                {
                    firstname, middlename, lastname, fathername, mothername, phonenumber, sessionyear, mentorname, mentorphnumber, mentoremailid,
                    mentordata: mentordetails._id, user_id: user_id
                }
            );
            await editedstudentdata.save()
            return res.status(200).json({ message: 'Given Student is Edited!', editedstudentdata })
        }
    } catch (error) {
        return res.status(500).json({ message: error });
    }

}

exports.Addsubjectdetails = async (req, res) => { // Add subject details.
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {

        const { id } = req.params; // Student ID.

        const Studentdetails = await AddStudentbyfac.findById({ _id: id });

        if (Studentdetails) {
            const { activesemester } = req.body;
            const semesters = req.body.semesters[0].semesters;; // Extract semesters array from req.body
            //console.log(semesters);
            //console.log(semesters);

            // Map through semesters and generate unique _id for each subject
            const formattedSemesters = semesters.map((semester) => {
                const formattedSubjects = semester.subjects.map((subject) => {
                    return {
                        ...subject,
                        _id: new mongoose.Types.ObjectId(), // Generate unique _id for each subject
                    };
                });

                return {
                    ...semester,
                    subjects: formattedSubjects,
                };
            });

            const addsubjectdetails = new Subjectdetails({
                Studentdata: id,
                activesemester,
                user_id: user_id,
                semesters: formattedSemesters,
            });
            await addsubjectdetails.save();
            return res.status(202).json({ message: 'Course Details Saved', addsubjectdetails });
        } else {
            return res.status(404).json({ message: 'student not found at this ID', id });
        }
    } catch (error) {
        console.error('Error in Addsubjectdetails controller:', error);
        return res.status(500).json({ message: 'something went worng', error });
    }

}

exports.Get_submittedAssignment_ByStudent = async (req, res) => { // Get assignment details

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        //console.log(user_id);
        const SubmitedassignmentDetails = await UploadassByfac.findOne({ user_id: user_id });
        // console.log(SubmitedassignmentDetails);
        if (SubmitedassignmentDetails) {
            const uploadedAssID = SubmitedassignmentDetails._id;
            //console.log(uploadedAssID);
            const studentdetails = await SubmitAssBYStudent.find({ WhichsubjectofAss: uploadedAssID }).populate('submitedBY');
            //console.log(studentdetails);
            if (studentdetails) {
                return res.status(200).json({ message: 'Details found', studentdetails })
            } else {
                return res.status(404).json({ message: 'Details not found' });
            }
        } else {
            return res.status(402).json({ message: 'Details not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error", error });
    }

}

exports.Get_PlageReport = async (req, res) => { // In assignment details, get plag report

    try {

        const { id } = req.params; // This is an PlagReport ID;

        const response = await axios.get('https://plagiarismsearch.com/api/v3/reports/sources/' + id, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'gouravkumarjhaa@gmail.com:dQIhakoFjzHhojkD63on9UiOgSvsttKypwDzrD2HidOfjrtqv-190213738',
            },
        });
        const result = response.data;
        if (response.status === 200) {
            console.log('Plagarisim Report Founded!');
            return res.status(200).json({ meessage: 'Report:- ', result })
        } else {
            console.error('Error:', result);
            return res.status(501).json({ meessage: 'Sorry! we could not find you Plag Report. Please ReTry', result })
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'error', error });
    }

}

exports.Remove_studentass_and_uplaodmarks = async (req, res) => { //checked student assignment and delete the report and assignment file and upload the marks
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    //console.log(user_id);
    try {
        const { id } = req.params; // student plag report id.
        const { studentassmarks } = req.body;

        const data = await SubmitAssBYStudent.findOne({ PlagReportID: id }).populate('WhichsubjectofAss'); // individual student submitted assignment details.
        //console.log(data);
        // console.log(user_id);
        const by = data.submitedBY;
        const whichass = data.WhichsubjectofAss.assbyfaculty;

        const assignmentdetails = await UploadassByfac.findOne({ assbyfaculty: whichass });// this find to helping for faculty detail bcz i need to concatenate subjectname+marks.
        // console.log(assignmentdetails);
        const facid = assignmentdetails.user_id;

        const facultydetail = await Facultysignup.findOne({ _id: facid }); // get faculty details of which subject of assignment.

        const subjectname = facultydetail.facultysubjectname;
        const conact_subject_marks = `${subjectname}:- ${studentassmarks}`;

        const uploadassnarks = new AddStudentRepotandComments({
            studentassmarks: conact_subject_marks, studentdata: by, user_id: user_id
        });
        await uploadassnarks.save(); // upload the marks.

        try {
            return res.status(200).json({ message: "Marks uploaded", uploadassnarks });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Inside try block of inside catch error...", error });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error", error });
    }
}

exports.Get_Uploaded_Notes = async (req, res) => { // Get Notes

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {

        const Notes = await Notesbyfac.find({ user_id: user_id });

        return res.status(200).json({ message: "Notes", Notes });

    } catch (error) {

        console.log(error);
        return res.status(500).json({ message: 'error', error });

    }
}

exports.Del_Uploaded_Notes = async (req, res) => { // Delete Notes

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {

        const { id } = req.params; // Notes id
        const Notes = await Notesbyfac.findByIdAndDelete({ _id: id });
        return res.status(200).json({ message: "Notes", Notes });

    } catch (error) {

        console.log(error);
        return res.status(500).json({ message: 'error', error });

    }
}

exports.Get_Individual_message = async (req, res) => { // Get message for faculty.

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        const Notifications = await IndividualNotifications.find({ Faculty_ID: user_id });
        // console.log(Notifications);
        // const id= Notifications.Admin_id;
        // const Admindetails= await AdminSignup.findOne({_id: id});
        // const AdminName= Admindetails.adminname;

        return res.status(200).json({ messgae: 'message fetched', Notifications })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });
    }
}

exports.Reply_Message_to_admin = async (req, res) => { // Reply Individual message for admin

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }

    try {

        const { Individualmessage, Which_message_Reply, Admin_id } = req.body;
        var file = "File not attached.";
        if (req.file) {
            file = req.file.filename;
        }

        const Replyfor_Admin = new Replyindividualmessage({
            Replymessage: Individualmessage,
            Which_message_Reply: Which_message_Reply,
            attachment: file,
            Faculty_ID: user_id,
            Admin_id: Admin_id
        });

        await Replyfor_Admin.save();
        return res.status(201).json(Replyfor_Admin);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });
    }

}

exports.Get_All_Replied_Message = async (req, res) => { // Get message.

    var user_id;
    if (req.user) {
        user_id = req.user._id.toString(); // Convert ObjectId to string;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }

    try {

        const { id } = req.params; // Obj_ID
        //console.log(user_id);
        const History = await Replyindividualmessage.find({ Which_message_Reply: id }).populate('Which_message_Reply');
        //console.log(History);
        // var Allmessage = [];
        // for (var i = 0; i < History.length; i++) {
        //     // console.log("Admin ID:", History[i].Admin_id, "User ID:", user_id); // Check Admin ID and User ID
        //     if (History[i].Admin_id === user_id) {
        //         Allmessage.push(History[i]);
        //     }
        // }

        //console.log(History);

        return res.status(200).json(History);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });
    }

}

exports.Delete_Replied_Message = async (req, res) => { // Delete message.

    var user_id;
    if (req.user) {
        user_id = req.user._id.toString(); // Convert ObjectId to string;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }

    try {
        const { id } = req.params; // Obj_ID
        const Del_Message = await Replyindividualmessage.findByIdAndDelete({ _id: id });
        return res.status(200).json(Del_Message);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });
    }

}

exports.Parse_Details = async (req, res) => { // Parse Student data

    var user_id;
    if (req.user) {
        user_id = req.user._id.toString(); // Convert ObjectId to string;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }

    try {
        try {
            const filepath = `./Upload/${req.file.filename}`;
            // console.log(filepath);
            fs.createReadStream(filepath)
                .pipe(csv.parse({ headers: true, }))
                .on('error', err => console.log("Fast-csv, err", err))
                .on('data', async row => {
                    console.log(row);

                    try {
                        // Find the user by username
                        const Facultyuser = await Facultysignup.findOne({ _id: user_id });

                        // If the user doesn't exist
                        if (!Facultyuser) {
                            return res.status(401).json({ message: 'Invalid credentials' });
                        }
                        const mentordetails = await Facultysignup.findOne({ facultyemail: row.mentoremailid });
                        if (!mentordetails) {
                            console.log('Mentor Email ID incorrect');
                            return res.status(400).json({ message: 'Mentor Name/Email ID incorrect' });
                        } else if (mentordetails.isfacultymentor === 'no') {
                            console.log('This is not a mentor in our Database!');
                            return res.status(400).json({ message: 'This is not a mentor in our Database!' });
                        } else {
                            // Hash the password before saving it to the database
                            const hashedPassword = await bcrypt.hash(row.password, 10);

                            const AddStudent = new AddStudentbyfac({
                                firstname: row.firstname, middlename: row.middlename, lastname: row.lastname, gender: row.gender, dob: row.dob, fathername: row.fathername, mothername: row.mothername, phonenumber: row.phonenumber, locality: row.locality, emailid: row.emailid, password: hashedPassword, coursename: row.coursename, coursetype: row.coursetype, sessionyear: row.sessionyear, rollnumber: row.rollnumber, enrollementnumber: row.enrollementnumber, courseyears: row.courseyears, sem1: row.sem1, sem2: row.sem2, sem3: row.sem3, sem4: row.sem4, sem5: row.sem5, sem6: row.sem6, sem7: row.sem7, sem8: row.sem8, mentorname: row.mentorname, mentorphnumber: row.mentorphnumber, mentoremailid: row.mentoremailid,
                                mentordata: mentordetails._id, user_id
                            });
                            // Save the Student to the database
                            await AddStudent.save();
                            return res.status(201).json(AddStudent);
                        }
                    } catch (error) {
                        console.log("Error while saving document", error);
                        return res.status(500)
                    }
                })
                .on('end', async rowCount => {
                    console.log(`${rowCount} row has been parsed successfully.`)
                })



        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'An error occurred', error: error });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });
    }

}

exports.Get_Shared_Data = async (req, res) => { // get incorrect details
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }

    try {

        const Shared_Individual = await RequestToincoorect.find({ Which_Admin_are_sent_To_Faculty: user_id }).populate('RequstedBY');

        return res.status(200).json({ Shared_Individual });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });
    }

}

exports.Close_incorrect = async (req, res) => {
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }

    try {

        const { id } = req.params; // obj_id
        await RequestToincoorect.findByIdAndUpdate({ _id: id },
            {
                status: "Completed"
            })

        const delete_ticket = await RequestToincoorect.findByIdAndDelete({ _id: id });

        return res.status(200).json({ delete_ticket })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });
    }
}


exports.Get_course_details = async (req, res) => {

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }

    try {

        const { id } = req.params;
        const Data = await Subjectdetails.findOne({ Studentdata: id });
        const Activesem = Data.activesemester;
        return res.status(200).json({ Activesem });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });
    }

}

exports.Edit_Active_sem = async (req, res) => {
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }

    try {

        const { id } = req.params;
        const { activesemester } = req.body;
        const Data = await Subjectdetails.findOne({ Studentdata: id });
        const Obj_id = Data._id;

        const Edited_obj = await Subjectdetails.findByIdAndUpdate({ _id: Obj_id }, {
            activesemester: activesemester
        })

        await Edited_obj.save();
        return res.status(200).json({ message: - "Edited active sem", Edited_obj });
    } catch (error) {

        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });
    }
}



// --- Below code all Student Portal --- 
exports.StudentSignINfunc = async (req, res) => { // SignIN Student.

    try {
        const { emailid, password } = req.body;

        // Find the user by username
        const Studentuser = await AddStudentbyfac.findOne({ emailid });

        // If the user doesn't exist
        if (!Studentuser) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, Studentuser.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Wrong credentials' });
        }

        if (Studentuser.studentstatus === 'active') {
            // Create a JWT token for the user
            const token = createToken(Studentuser._id)

            // Respond with the token
            return res.status(200).json({ token, emailid, Studentuser });
        } else {
            return res.status(402).json({ message: 'Blocked status found' });
        }


    } catch (err) {
        return res.status(500).json({ message: 'An error occurred', error: err });
    }
}

exports.IndividualStudentDetail = async (req, res) => {// Get Individual Student
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        const Individualstudentdetails = await AddStudentbyfac.findOne({ _id: user_id }).populate('mentordata');
        res.status(200).json(Individualstudentdetails); // for postman app
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.GetStudentReport = async (req, res) => { // Get Individual Student Report

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {

        const Individualstudentreport = await AddStudentRepotandComments.find({ studentdata: user_id }).populate('studentdata');
        res.status(200).json(Individualstudentreport); // for postman app

    } catch (error) {
        return res.status(500).json(error);
    }
}

exports.Delete_student_Comments = async (req, res) => { // Delete comments by student

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {

        const { id } = req.params;
        const StudentDetails = await AddStudentbyfac.findById({ _id: user_id });
        if (!StudentDetails) {
            return res.status(401).json({ message: "Student Not Found" });
        } else {

            const deletedstudentcomment = await AddStudentRepotandComments.findByIdAndDelete({ _id: id });
            return res.status(200).json({ message: 'Given Comments is deleted', deletedstudentcomment })
        }
    } catch (err) {
        return res.status(500).json({ message: err });
    }

}

exports.Get_All_Assignments = async (req, res) => { // Get all assignments.

    try {
        const Allassignments = await UploadassByfac.find();
        return res.status(200).json({ message: 'Assignments are:- ', Allassignments })
    } catch (err) {
        return res.status(500).json({ message: err });
    }

}

exports.Get_All_Notifications = async (req, res) => { // Get all Notifications.

    try {
        const Allnotifications = await Notificationsbyfac.find();
        return res.status(200).json({ message: 'Notifications are:- ', Allnotifications })
    } catch (err) {
        return res.status(500).json({ message: err });
    }

}

exports.CheckPlag = async (req, res) => { // check Plagarism
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const { id } = req.params; // This is which subject of assignment student submited.
        const studentsubmitteddata = [] = await SubmitAssBYStudent.find({ submitedBY: user_id });

        if (!studentsubmitteddata) {
            return res.status(401).json({ message: "Student not found" });
        }
        var arr_submitassID = [];
        for (var i = 0; i < studentsubmitteddata.length; i++) {
            arr_submitassID.push(studentsubmitteddata[i].WhichsubjectofAss)
        }
        //studentsubmitteddata.WhichsubjectofAss;

        const index = arr_submitassID.findIndex(item => item.toString() === id);
        if (index !== -1) {
            return res.status(402).json({ message: "Already Submited" });
        } else {
            const formData = new FormData();
            // Add form fields
            const fileDetails = req.file;

            const fileContent = fs.readFileSync(fileDetails.path);
            formData.append('document', fileContent, {
                filename: fileDetails.originalname,
                contentType: fileDetails.mimetype,
            });
            formData.append('title', req.file.filename);
            formData.append('remote_id', "REM-" + uniqid());
            formData.append('is_search_web', '1');
            formData.append('is_search_filter_chars', '0');
            formData.append('is_search_filter_references', '0');
            formData.append('is_search_filter_quotes', '0');
            formData.append('search_web_disable_urls', '[]');
            formData.append('search_web_exclude_urls', '[]');
            formData.append('is_search_ai', '1');
            formData.append('is_search_storage', '1');
            formData.append('is_add_storage', '1');
            formData.append('search_storage_filter', JSON.stringify({
                file_id: [100, 500],
                user_id: [42, 2],
                group_id: [100, 500],
            }));
            formData.append('search_storage_user_group', JSON.stringify([2, 500]));
            formData.append('search_storage_proximity', '0.9');
            formData.append('search_storage_sensibility_percentage', '40');
            formData.append('search_storage_sensibility_words', '3');
            formData.append('storage_group_id', '112');
            formData.append('storage_user_id', '40');
            formData.append('storage_file_id', '111');
            formData.append('is_json', '1');
            formData.append('force', '0');

            const apiUrl = 'https://plagiarismsearch.com/api/v3/reports/create';
            const response = await axios.post(apiUrl, formData, {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': 'gouravkumarjhaa@gmail.com:dQIhakoFjzHhojkD63on9UiOgSvsttKypwDzrD2HidOfjrtqv-190213738',
                },
            });

            const result = response.data;
            if (response.status === 202) {
                const SubmitAssData = new SubmitAssBYStudent({
                    WhichsubjectofAss: id, submitedBY: user_id, user_id: user_id, PlagReportID: result.data.id, Assignment: req.file.filename
                })

                await SubmitAssData.save();
                return res.status(200).json({ message: "Assignment Submited, Please wait for check Plagarisim", result, SubmitAssData, user_id });
            }
            else {
                console.error('Error:', result);
                return res.status(501).json({ message: "Please Re-submit your assignment, because fault happen", result, SubmitAssData, user_id })
            }
        }


    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.GetPlagReport = async (req, res) => { // Get Plag Report

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        const { id } = req.params; // This is Assignment ID means this ID  "WhichsubjectofAss".
        //console.log(id);
        const Submiteddata = await SubmitAssBYStudent.find({ submitedBY: user_id });
        //console.log(Submiteddata);
        if (Submiteddata.length > 0) {
            var AssignementData = [];
            for (var i = 0; i < Submiteddata.length; i++) {
                if (Submiteddata[i].WhichsubjectofAss.toString() === id) {
                    AssignementData = Submiteddata[i];
                    break;
                }
            }

            if (AssignementData) {
                //console.log(AssignementData);
                const p_id = AssignementData.PlagReportID;
                if (!p_id) {
                    return res.status(404).json({ meessage: 'Not found' })
                } else {
                    const response = await axios.get('https://plagiarismsearch.com/api/v3/reports/sources/' + p_id, {
                        headers: {
                            'Content-type': 'application/json',
                            'Authorization': 'gouravkumarjhaa@gmail.com:dQIhakoFjzHhojkD63on9UiOgSvsttKypwDzrD2HidOfjrtqv-190213738',
                        },
                    });
                    const result = response.data;
                    const OtherAssData = await SubmitAssBYStudent.findOne({ PlagReportID: p_id }).populate('WhichsubjectofAss').populate('submitedBY');
                    //console.log(OtherAssData);
                    const AssData = AssignementData;
                    const AssDataofwhichsubject = OtherAssData.WhichsubjectofAss;
                    const By = OtherAssData.submitedBY;

                    if (response.status === 200) {
                        //console.log('Plagarisim Report Founded!');
                        return res.status(200).json({ meessage: 'Report:- ', result, AssData, AssDataofwhichsubject, By })
                    } else {
                        console.error('Error:', result);
                        return res.status(501).json({ meessage: 'Sorry! we could not find you Plag Report. Please ReTry', result })
                    }
                }

            } else {
                return res.status(503).json({ meessage: 'This subject of your assignment not found' });
            }
        } else {
            return res.status(502).json({ meessage: 'Sorry! we could not find. Please provide correct ID', id });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'something went wrong', error });
    }
}

exports.DeletePlagReport = async (req, res) => { // Delete Plag Report


    try {
        const { id } = req.params; // This is PlagID when data save in our DB.
        const Submiteddata = await SubmitAssBYStudent.findOne({ PlagReportID: id });

        if (Submiteddata) {
            const p_id = Submiteddata.PlagReportID;
            const response = await axios.get('https://plagiarismsearch.com/api/v3/reports/delete/' + p_id, {
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'gouravkumarjhaa@gmail.com:dQIhakoFjzHhojkD63on9UiOgSvsttKypwDzrD2HidOfjrtqv-190213738',
                },
            });
            const result = response.data;
            if (response.status === 200) {
                //console.log('Plagarisim Report Deleted!');
                const Del_DB_id = Submiteddata._id;
                const Del_Data = await SubmitAssBYStudent.findByIdAndDelete({ _id: Del_DB_id });
                return res.status(200).json({ meessage: 'Report:- ', result, Del_Data })
            } else {
                console.error('Error:', result);
                return res.status(500).json({ meessage: 'Sorry! we could not delete your Plag Report. Please ReTry', result })
            }
        } else {
            return res.status(500).json({ meessage: 'Sorry! we could not delete. Please provide correct ID', id });
        }

    } catch (error) {
        return res.status(500).json({ message: 'something went wrong', error });
    }
}

exports.Getsubjectdetails = async (req, res) => { // Get subject details.
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        // const search = req.query.search || null;
        // const query = {

        //     subjectName: { $regex: search, $options: "i" } // For search 
        //   }
        const coursedetails = await Subjectdetails.findOne({ Studentdata: user_id })

        return res.status(200).json({ message: 'Course Details', coursedetails });
    } catch (error) {
        return res.status(500).json({ message: 'something went worng', error });
    }

}

exports.GetCourse_Notes = async (req, res) => { // Get Notes Individual

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }

    try {
        if (!req.params) {
            return res.status(404).json({ messsage: 'Not Found' });
        }
        const { id } = req.params;

        const Get_course_details = await Subjectdetails.findOne({ Studentdata: user_id });
        if (!Get_course_details) {
            return res.status(404).json({ messsage: 'Not Found' });
        }
        const StudentActivesem = Get_course_details.activesemester;
        const Semesters = [] = Get_course_details.semesters;
        var Store_Details = [];
        var Subject_Name;
        for (var i = 0; i < Semesters.length; i++) {
            if (Semesters[i].semester === StudentActivesem) {


                const semesterDetails = Semesters[i];
                // Store_Details.push(D);
                for (var j = 0; j < semesterDetails.subjects.length; j++) {
                    const subjectDetails = semesterDetails.subjects[j];
                    //console.log(`Subject ${ j + 1 }: `, subjectDetails);

                    // Store the subject details in the Store_Details array
                    Store_Details.push(subjectDetails);
                }
                break;
            }
        }

        if (Store_Details.length === 0) {
            return res.status(404).json({ messsage: 'Not Found' });
        }
        for (var i = 0; i < Store_Details.length; i++) {
            if (Store_Details[i]._id.toString() === id.toString()) {
                Subject_Name = Store_Details[i].subjectName;
                break;
            }
        }

        const Facultyuser = await Facultysignup.findOne({ facultysubjectname: Subject_Name });
        if (!Facultyuser) {
            return res.status(404).json({ messsage: 'Faculty Not Found' });
        }
        //console.log(Facultyuser);
        const Notes = await Notesbyfac.find({ user_id: Facultyuser._id });
        if (!Notes) {
            return res.status(404).json({ messsage: 'Not Found' });
        }
        //console.log(Notes);
        else {

            return res.status(200).json({ message: "Your Notes", Notes });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong", error });
    }

}


exports.Extract_Data = async (req, res) => {

    try {

        const { id } = req.params;
        // const filepath = path.join(__dirname, 'uploads', `${ id } `);
        const filepath = `./Upload/${id} `;
        const dataBuffer = fs.readFileSync(filepath);
        // const data = new Uint8Array(dataBuffer);
        let textContent = '';

        // Extract text based on file extension
        if (filepath.endsWith('.pdf')) {
            const result = await pdfParse(dataBuffer);
            textContent = result.text;
        } else if (filepath.endsWith('.docx')) {
            const result = await mammoth.extractRawText({ path: filepath, arrayBuffer: dataBuffer });
            textContent = result.value;
        } else {
            // Handle other document types as needed
            // For simplicity, consider using a default text extraction approach
            textContent = dataBuffer.toString('utf-8');
        }
        //console.log(textContent);
        return res.status(200).json({ textContent })

        //return res.status(200).json({ dataBuffer });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'error', error })
    }
}

exports.Add_Student_Task_progress = async (req, res) => { // Add task.

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(404).json({ message: 'ID Not found' });
        }
        else {

            const checktask = await Studenttaskprogress.findOne({ completedtask: id });
            //console.log(checktask);
            if (checktask) {
                return res.status(501).json({ message: 'You already complete this task', checktask });
            } else {
                const submitTask = new Studenttaskprogress({
                    completedtask: id,
                    studentdata: user_id,
                    user_id: user_id
                });

                await submitTask.save();

                return res.status(200).json({ message: 'task added', submitTask })
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'error', error });
    }

}

exports.Get_Progress = async (req, res) => { // Get task progress.

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {

        const Data = await Studenttaskprogress.find({ studentdata: user_id });
        if (!Data) {
            return res.status(404).json({ message: 'Not Found' });
        } else {
            const TaskID = [];
            for (var i = 0; i < Data.length; i++) {
                TaskID.push(Data[i].completedtask)
            }
            return res.status(200).json({ message: 'Progress Report', TaskID })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'sonething wrong', error });
    }

}

exports.GenerateTicke = async (req, res) => { // add form for feedback/complaint.
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {

        var filenaame;
        if (req.file) {
            filenaame = req.file.filename;
        }
        const { subject, description } = req.body;
        const submitform = new ComplaintorFeedback({
            subject,
            description,
            problemimage: filenaame,
            createdBY: user_id,
            user_id: user_id
        })

        await submitform.save();
        return res.status(200).json({ message: 'Ticket raised', submitform });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'error', error });
    }
}

exports.Get_Resloved_Tickets = async (req, res) => { // Get Resolved Tickets

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }

    try {

        const Resolved_Tickets = await ComplaintorFeedback.find({ createdBY: user_id });
        return res.status(200).json({ Resolved_Tickets });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });

    }



}

exports.Add_Request_To_Change_details = async (req, res) => {

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }

    try {

        const { Faculty_ID, selectedval } = req.body;
        const flag = await RequestToincoorect.findOne({ RequstedBY: user_id });

        if (flag) {
            return res.status(400).json({ flag });
        } else {
            const Obj_Request = new RequestToincoorect({
                RequstedBY: user_id,
                ChangedBY: Faculty_ID,
                firstname: selectedval.firstname ? selectedval.firstname : "NULL",
                middlename: selectedval.middlename ? selectedval.middlename : "NULL",
                lastname: selectedval.lastname ? selectedval.lastname : "NULL",
                gender: selectedval.gender ? selectedval.gender : "NULL",
                dob: selectedval.dob ? selectedval.dob : "NULL",
                fathername: selectedval.fathername ? selectedval.fathername : "NULL",
                mothername: selectedval.mothername ? selectedval.mothername : "NULL",
                phonenumber: selectedval.phonenumber ? selectedval.phonenumber : "NULL",
                locality: selectedval.locality ? selectedval.locality : "NULL",

            });

            await Obj_Request.save();
            return res.status(200).json({ Obj_Request });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });
    }
}



// Below code of admin controller's 
exports.AdminSignupfunc = async (req, res) => { // Signup Admin.


    try {
        // const file = req.file.filename;
        // console.log(req.file);

        const base64Data = req.body.adminprofileimg.replace(/^data:image\/png;base64,/, '');
        const fileName = `./Upload/${Date.now()}.png`; // Unique file name with path
        const fileNamewithoutpath = `${Date.now()}.png`; // Unique file name without path
        fs.writeFile(fileName, base64Data, 'base64', async function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error saving image' });
            }

            const { adminname, adminphonenumber, adminemail, adminpassword } = req.body;

            // only create two admin account if any third person want to create admin account so that alert mail automatic sent to previous admin.
            const TotalSizeof_admin_acc = await AdminSignup.find();
            if (TotalSizeof_admin_acc.length == 2) {

                const badactivity = new Sucpeciousadmin({
                    adminprofileimg: fileNamewithoutpath,
                })
                await badactivity.save();
                return res.status(402).json({ message: 'Alert' });
            } else {

                // Check if the username already exists
                const existingUser = await AdminSignup.findOne({ adminemail });
                if (existingUser) {
                    return res.status(400).json({ message: 'Admin already exists' });
                }

                // Hash the password before saving it to the database
                const hashedPassword = await bcrypt.hash(adminpassword, 10);

                // Create a new user
                const newadminRegisteration = new AdminSignup({
                    adminname,
                    adminphonenumber,
                    adminemail,
                    adminprofileimg: fileNamewithoutpath,
                    adminpassword: hashedPassword,
                });

                // Save the user to the database
                await newadminRegisteration.save();
                const token = createToken(newadminRegisteration._id)
                // Respond with success message
                res.status(201);
                res.status(201).json({ message: 'Registration successful', newadminRegisteration, token });
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'An error occurred', error: err });
    }
}

exports.AdminSignINfunc = async (req, res) => { // SignIN Admin.

    try {
        const { adminemail, adminpassword } = req.body;

        // Find the user by username
        const Admin = await AdminSignup.findOne({ adminemail });

        // If the user doesn't exist
        if (!Admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(adminpassword, Admin.adminpassword);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Wrong credentials' });
        }

        // Create a JWT token for the user
        const token = createToken(Admin._id)

        // Respond with the token
        res.status(200).json({ token, adminemail, Admin });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err });
    }
}

exports.GetSucipicousactivity = async (req, res) => { // get sucpicious activity

    try {

        const Activity = await Sucpeciousadmin.find(); // Get all sucpecious activity.
        return res.status(200).json({ message: 'Activity', Activity });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error });
    }

}

exports.Delete_Sucipicousactivity = async (req, res) => { // Delete sucpicious activity

    try {

        const { id } = req.params;
        const Activity = await Sucpeciousadmin.findByIdAndDelete({ _id: id }); // Get sucpecious activity.
        return res.status(200).json({ message: 'Activity Deleted', Activity });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error });
    }

}

exports.UplaodNotificationsbyFac = async (req, res) => { // Upload Notifications By Admin to student
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        // Find the user by username
        const Facultyuser = await AdminSignup.findOne({ _id: user_id });

        // If the user doesn't exist
        if (!Facultyuser) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const file = req.file.filename;
        const uploadnotifications = new Notificationsbyfac({
            notificationsbyfac: file,
            user_id
        })
        await uploadnotifications.save(); // Uplaod ass in DB
        // Respond with success message
        res.status(201);
        res.status(201).json({ message: 'Notification successful', uploadnotifications, user_id });

    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err });
    }
}

exports.Delete_Studentnotification = async (req, res) => { // Delete Student  Notification

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        const { id } = req.params;
        const Leftout = await Notificationsbyfac.findByIdAndDelete({ _id: id }); // Get sucpecious activity.
        return res.status(200).json({ message: 'Deleted', Leftout });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error });
    }

}

exports.UplaodNotificationsforFaculty = async (req, res) => { // Upload Notifications By Admin to Faculty
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        // Find the user by username
        const Facultyuser = await AdminSignup.findOne({ _id: user_id });

        // If the user doesn't exist
        if (!Facultyuser) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const file = req.file.filename;
        const uploadnotifications = new NotificationsforFaculty({
            notificationsforfaculty: file,
            user_id
        })
        await uploadnotifications.save(); // Uplaod ass in DB
        // Respond with success message
        res.status(201);
        res.status(201).json({ message: 'Notification successful', uploadnotifications, user_id });

    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err });
    }
}

exports.Get_All_Faculty_Notifications = async (req, res) => { // Get all Faculty Notifications.

    try {
        const Allnotifications = await NotificationsforFaculty.find();
        return res.status(200).json({ message: 'Notifications are:- ', Allnotifications })
    } catch (err) {
        return res.status(500).json({ message: err });
    }

}

exports.Delete_Facultynotification = async (req, res) => { // Delete Faculty  Notification

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        const { id } = req.params;
        const Leftout = await NotificationsforFaculty.findByIdAndDelete({ _id: id });
        return res.status(200).json({ message: 'Deleted', Leftout });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error', error });
    }

}

exports.Get_all_Faculty = async (req, res) => { // Get all faculty
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {

        const AllFaculty = await Facultysignup.find();
        return res.status(200).json({ message: 'All Faculty', AllFaculty, user_id })
    } catch (err) {
        return res.status(500).json(err)
    }
}

exports.Send_Individual_message = async (req, res) => { // send message for faculty.

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        const { id } = req.params; // Faculty ID
        const { Individualmessage } = req.body;
        var file = "file not uploaded";
        if (req.file) {
            file = req.file.filename;
        }
        const SavedIndividualmessage = new IndividualNotifications({
            Individualmessage,
            attachment: file,
            Faculty_ID: id,
            Admin_id: user_id
        });

        await SavedIndividualmessage.save();
        return res.status(201).json({ messgae: 'message sent', SavedIndividualmessage })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });
    }
}

exports.Get_individual_progress_faculty = async (req, res) => {// Get faculty Progress

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {
        const { id } = req.params
        const Individualfacultytasks = await AddTaskbyfac.find({ user_id: id });
        // console.log(Individualfacultytasks);
        res.status(200).json({ Individualfacultytasks }); // for postman app
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.Get_Message_According_Faculty_ID = async (req, res) => { // Get message.

    var user_id;
    if (req.user) {
        user_id = req.user._id.toString(); // Convert ObjectId to string;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }

    try {

        const { id } = req.params; // Faculty ID
        //console.log(user_id);
        const History = await Replyindividualmessage.find({ Faculty_ID: id }).populate('Which_message_Reply');
        //console.log(History);
        var Allmessage = [];
        for (var i = 0; i < History.length; i++) {
            // console.log("Admin ID:", History[i].Admin_id, "User ID:", user_id); // Check Admin ID and User ID
            if (History[i].Admin_id === user_id) {
                Allmessage.push(History[i]);
            }
        }

        //  console.log(Allmessage);

        return res.status(200).json(Allmessage);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });
    }

}

exports.Get_All_Message_According_Faculty_ID = async (req, res) => { // Get All message.

    var user_id;
    if (req.user) {
        user_id = req.user._id; // Convert ObjectId to string;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }

    try {

        const { id } = req.params; // Faculty ID
        //const S_id= id.toString();

        // console.log("S_id:", S_id);
        const All_Admin_message = await IndividualNotifications.find({ Admin_id: user_id });
        // console.log(All_Admin_message);
        // const History = await Replyindividualmessage.find({ Faculty_ID: id }).populate('Which_message_Reply');

        var Allmessage = [];
        for (var i = 0; i < All_Admin_message.length; i++) {
            // console.log("Admin ID:", History[i].Admin_id, "User ID:", user_id); // Check Admin ID and User ID
            if (All_Admin_message[i].Faculty_ID.toString() === id) {
                Allmessage.push(All_Admin_message[i]);
            }
        }

        //console.log(Allmessage);

        return res.status(200).json(Allmessage);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });
    }

}

exports.Delete_Faculty = async (req, res) => { // Delete Faculty

    var user_id;
    if (req.user) {
        user_id = req.user._id; // Convert ObjectId to string;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }

    try {

        const { id } = req.params; // Faculty Id 

        const Deleted_faculty = await Facultysignup.findByIdAndDelete({ _id: id });
        return res.status(200).json(Deleted_faculty)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });
    }

}

exports.Del_Message = async (req, res) => { // Delete Admin Message 

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {

        const { id } = req.params; // Obj_id

        const Del_chat = await IndividualNotifications.findByIdAndDelete({ _id: id });
        return res.status(200).json(Del_chat)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });
    }


}

exports.Get_Support_Message = async (req, res) => { // Get support

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {

        const tickets = await ComplaintorFeedback.find().populate('createdBY');
        return res.status(200).json({ tickets });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });
    }

}

exports.Add_ticket_Reply_message = async (req, res) => {
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }

    try {

        const { val } = req.body;
        const { id } = req.params; // object id
        // console.log(id);

        const AddRepliedmessage = await ComplaintorFeedback.findByIdAndUpdate(
            { _id: id },
            {
                Replybyadmin: val
            });

        await AddRepliedmessage.save();
        return res.status(200);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });
    }
}

exports.Close_ticket = async (req, res) => {
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }

    try {

        const { id } = req.params; // object id
        // console.log(id);
        const clsoeticket = await ComplaintorFeedback.findByIdAndDelete({ _id: id });
        return res.status(200).json({ clsoeticket });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });
    }
}

exports.Get_Incorrectdetails_Req = async (req, res) => {

    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }

    try {

        const All_Incorrectdetails = await RequestToincoorect.find().populate('RequstedBY').populate('ChangedBY');

        return res.status(200).json({ All_Incorrectdetails });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });

    }

}

exports.Share_Incorrect_details_with_fac = async (req, res) => {
    var user_id;
    if (req.user) {
        user_id = req.user._id;
    } else {
        return res.status(401).json({ message: "Invalid User!" });
    }
    try {

        const { id } = req.params;
        const { Message, Obj_id } = req.body;
        await RequestToincoorect.findByIdAndUpdate({ _id: Obj_id },
            {
                status: "Shared"
            })
        const shared_obj = await RequestToincoorect.findOneAndUpdate({ ChangedBY: id },
            {
                Which_Admin_are_sent_To_Faculty: id,
                Message_By_Admin: Message,
            },

            { new: true } // Ensure you get the updated document
        )
        await shared_obj.save();
        return res.status(200).json({ shared_obj });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: error });
    }
}



// Below code for chat application

exports.Create_user_acc = async (req, res) => {

    try {

        const file = req.file.filename; // profile Img

        const { firstname, lastname, emailaddress, password, AccType, user_id } = req.body;

        const Onlyoneaccount_valid = await Chat_user.findOne({ user_id: user_id }); // one person have only one account.
        if (Onlyoneaccount_valid) {
            return res.status(400).json({ message: 'User already exists' });
        }
        else {
            // Check if the username already exists
            const existingUser = await Chat_user.findOne({ emailaddress });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            else {
                // Hash the password before saving it to the database
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create a new user
                const newuser = new Chat_user({
                    firstname,
                    lastname,
                    user_id,
                    emailaddress,
                    profileImg: file,
                    password: hashedPassword,
                    AccType
                });

                // Save the user to the database
                await newuser.save();
                const token = createToken(newuser._id)
                // Respond with success message
                res.status(201);
                res.status(201).json({ message: 'Account created', newuser, token });
            }

        }


    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
exports.Login_eagle_user = async (req, res) => {
    try {
        const { emailaddress, password } = req.body;
        const { id } = req.params;
        //console.log(id);
        const Protection = await Chat_user.findOne({ user_id: id }); // Protection.
        // console.log(Protection);
        const Already_saved_user_Emailid = Protection.emailaddress;

        if (emailaddress !== Already_saved_user_Emailid) {
            return res.status(401).json({ message: 'This is not user handel' });
        } else {
            // Find the user by username
            const eageluser = await Chat_user.findOne({ emailaddress });

            // If the user doesn't exist
            if (!eageluser) {
                return res.status(401).json({ message: 'Invalid credentials' });
            } else {
                // Check if the password is correct
                const passwordMatch = await bcrypt.compare(password, eageluser.password);

                if (!passwordMatch) {
                    return res.status(401).json({ message: 'Wrong credentials' });
                } else {
                    // Create a JWT token for the user
                    const token = createToken(eageluser._id)

                    // Respond with the token
                    res.status(200).json({ token, emailaddress, eageluser });
                }

            }
        }

    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err });
    }
}
exports.Get_Individual_profile = async (req, res) => {

    try {

        const { id } = req.params;
        const Eagler = await Chat_user.findById({ _id: id });
        //console.log(Eagler);
        return res.status(200).json({ Eagler })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: err });
    }
}
exports.Get_All = async (req, res) => {

    try {
        const search = req.query.search || ""
        const query = {

            firstname: { $regex: search, $options: "i" } // For search 
        }
        const Eagler = await Chat_user.find(query);
        //console.log(Eagler);
        return res.status(200).json({ Eagler })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: err });
    }
}
exports.Edit_profile = async (req, res) => {

    try {

        const { id } = req.params;
        const { firstname, lastname } = req.body;
        //console.log(req.body);
        const existuserdata = await Chat_user.findById({ _id: id });
        var filename = "";
        if (req.file) {
            filename = req.file.filename;
        } else {
            filename = existuserdata.profileImg;
        }

        const Edited_profile = await Chat_user.findByIdAndUpdate({ _id: id },
            {
                firstname,
                lastname,
                profileImg: filename
            });
        await Edited_profile.save();
        return res.status(200).json({ Edited_profile })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An error occurred', error: err });
    }
}
exports.Get_Friend_data = async (req, res) => {
    try {
        const { id } = req.params; // Friend ID

        const Friend_obj = await Chat_user.findById({ _id: id });
        return res.status(200).json({ Friend_obj });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}
exports.Chat_with_friends = async (req, res) => {

    try {

        const { id } = req.params; // Reciver ID
        const Reciver_id = id;
        const { Sender_id, message } = req.body;
        const time = new Date
        const Records = new Conversation({
            Records: [{ sender_id: Sender_id, receiver_id: Reciver_id, message: message, time: time }],
            sender_id: Sender_id,
            reciver_id: Reciver_id,
            user_id: Sender_id
        });

        await Records.save();
        return res.status(201).json({ Records });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}
exports.Get_Friend_with_chat = async (req, res) => {
    try {
        const Rec_id = req.params.Rec_id; // friend ID
        //console.log("RecID:-", Rec_id);
        const Sender_id = req.params.Sender_id;
        //console.log("senderID:-", Sender_id);
        const Sender_One_obj = await Conversation.find({ user_id: Sender_id });
        //console.log("Data 1", Sender_One_obj);
        const Oneparty_obj = [];
        for (var i = 0; i < Sender_One_obj.length; i++) {
            if (Sender_One_obj[i].reciver_id.toString() === Rec_id) {
                Oneparty_obj.push(Sender_One_obj[i]);
            }
        }
        //console.log("Data 1", Oneparty_obj);

        const Sender_second_obj = await Conversation.find({ user_id: Rec_id });
        //console.log("Data 2", Sender_second_obj);
        const secondparty_obj = [];
        for (var i = 0; i < Sender_second_obj.length; i++) {
            if (Sender_second_obj[i].reciver_id.toString() === Sender_id) {
                secondparty_obj.push(Sender_second_obj[i]);
            }
        }
        //console.log("Data 2", secondparty_obj);
        return res.status(200).json({ Oneparty_obj, secondparty_obj });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}

exports.Get_All_friend_chat = async (req, res) => {
    try {
        const Sender_id = req.params.Sender_id;
        //console.log("senderID:-", Sender_id);
        const obj_one = await Conversation.find({ reciver_id: Sender_id }).populate('sender_id'); // when y-person send a message to x. 
        const obj_two = await Conversation.find({ sender_id: Sender_id }).populate('reciver_id'); // when x-person send a message to y. 

        const uniqueConversationsMap = {};

        // Function to add conversation to the map if not already present
        const addConversationToMap = (conversation) => {
            const otherParticipantId = conversation.sender_id._id.toString() !== Sender_id ? conversation.sender_id._id : conversation.reciver_id._id;
            if (!uniqueConversationsMap[otherParticipantId]) {
                uniqueConversationsMap[otherParticipantId] = conversation;
            }
        };

        // Add conversations from obj_one to the map
        obj_one.forEach(conversation => addConversationToMap(conversation));

        // Add conversations from obj_two to the map
        obj_two.forEach(conversation => addConversationToMap(conversation));

        // Convert the map values to an array
        const mergedObjects = Object.values(uniqueConversationsMap);
       // console.log(mergedObjects);
        return res.status(200).json({ mergedObjects });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}