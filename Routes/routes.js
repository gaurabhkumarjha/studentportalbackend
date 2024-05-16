const express = require('express');
const router = new express.Router();
const FacultyProfileupload = require('../Middleware/MulterRegistrationFaculty');
const Controllers = require('../Controllers/controllers')
const FacultyAuthmiddelware = require('../Middleware/FacultyAuthmiddelware');
const StudentAuthmiddleware = require("../Middleware/StudentAuthmiddelware");
const AdminAuthmiddelware = require('../Middleware/AdminAuthmiddelware');
const CommonuploadByfac = require('../Middleware/MulterUploadAssbyfac');


// Below Routes for faculty 

router.post("/facultyregistration", FacultyProfileupload.single("facultyprofileimg"), Controllers.FacultySignupfunc)// Registration Faculty.
router.post("/facultylogin", Controllers.FacultySignINfunc); //SignIN Faculty.
router.get("/get/individualfacultydetail", FacultyAuthmiddelware, Controllers.IndividualFacultyDetail); // Get individual faculty Detail's.
router.put("/editfacultyindividual", FacultyProfileupload.single("facultyprofileimg"), FacultyAuthmiddelware, Controllers.Edtifacultyfunc); //Edit Faculty Details

router.post("/addtask", FacultyAuthmiddelware, Controllers.AddTaskByFaculty); //Add Task By Individual Faculty
router.get("/get/alltasks", FacultyAuthmiddelware, Controllers.Getalltasksbyfaculty); //Get All Task's By Individual Faculty
router.delete("/delete/completedtask/:id", FacultyAuthmiddelware, Controllers.Deletespecifictask); //Delete Specific/completed task.
router.put("/edittask/:id", FacultyAuthmiddelware, Controllers.EditFacultytaskprogress);//Edit Faculty Task Progress only.

router.post("/upload/assignment/byfaculty", FacultyAuthmiddelware, CommonuploadByfac.single('assbyfaculty'), Controllers.UplaodAssbyFac);//Upload Assignment by Faculty.
router.post("/upload/notes/byfaculty", FacultyAuthmiddelware, CommonuploadByfac.single('notesbyfac'), Controllers.UplaodNotesbyFac);//Upload Notes by Faculty.


router.post("/addstudent", FacultyAuthmiddelware, Controllers.AddstudentByfaculty);//Add student by faculty.

router.post("/parse/student/details", FacultyAuthmiddelware, CommonuploadByfac.single('Parse-File'), Controllers.Parse_Details); // Parse student details.

router.get("/getallstudent", FacultyAuthmiddelware, Controllers.GetstudentByfaculty); //Get All student.
router.get("/Individualstudent/:id", FacultyAuthmiddelware, Controllers.getstudentdetails_Fortoggle); //Get Individual student.
router.put("/cheangestatusofstudent/:id", FacultyAuthmiddelware, Controllers.ChanegStatusByFac);// Change the status of the student.

router.post("/student/add/reportcard-comments/:id", FacultyAuthmiddelware, Controllers.AddStudentReports); //Add Student Report's & Comment's
router.delete("/delete-student/:id", FacultyAuthmiddelware, Controllers.Delete_student); //Delete student
router.put("/edit/studen-details/:id", FacultyAuthmiddelware, Controllers.EditStudent_Details); //Edit student details

router.delete("/deleteplag/report/:id", FacultyAuthmiddelware, Controllers.DeletePlagReport); //Delete Plag Report By Faculty only.

router.post("/add/student/coures-details/:id", FacultyAuthmiddelware, Controllers.Addsubjectdetails); // Adding student course details
router.get("/get/student-submit-assignment", FacultyAuthmiddelware, Controllers.Get_submittedAssignment_ByStudent);// Get student assignment files.
router.get("/get/selected/student/plag/report/:id", Controllers.Get_PlageReport); // Get Plag REport by id.
router.post("/add/assignment-marks/and/delete/report/:id", FacultyAuthmiddelware, Controllers.Remove_studentass_and_uplaodmarks); // checked student assignment and delete the report and assignment file and upload the marks
router.get("/get/notes", FacultyAuthmiddelware, Controllers.Get_Uploaded_Notes); // Get notes
router.delete("/del/notes/:id", FacultyAuthmiddelware, Controllers.Del_Uploaded_Notes); // delete notes.
router.get("/get/individual/message", FacultyAuthmiddelware, Controllers.Get_Individual_message);//Get Individual message 
router.post("/faculty/reply/individual/message/for-admin", FacultyAuthmiddelware, CommonuploadByfac.single('attachment'), Controllers.Reply_Message_to_admin); // Reply for admin
router.get("/get/replied/message/:id", FacultyAuthmiddelware, Controllers.Get_All_Replied_Message); // Get all replied message.
router.delete("/Delete/replied/message/:id", FacultyAuthmiddelware, Controllers.Delete_Replied_Message); //Delete specific chat
router.get("/get/shared/data", FacultyAuthmiddelware, Controllers.Get_Shared_Data); // Get incorrect details by id
router.delete("/f/close/ticket/:id", FacultyAuthmiddelware, Controllers.Close_incorrect); // close incorrect details ticket
router.get("/get/coures-details/:id", FacultyAuthmiddelware, Controllers.Get_course_details); // get course details.
router.put ("/edit/active/sem/:id", FacultyAuthmiddelware, Controllers.Edit_Active_sem); // Edit active sem.







/* --- Below Down all Student Portal Routes --- */
router.post("/login-as-student", Controllers.StudentSignINfunc); //SignIN Student.
router.get("/get/individual/studentdetails", StudentAuthmiddleware, Controllers.IndividualStudentDetail); //Get Student details
router.get("/get/individual-student-report", StudentAuthmiddleware, Controllers.GetStudentReport);//Get Individual Student Report's
router.delete("/delete/comments/bystudent/:id", StudentAuthmiddleware, Controllers.Delete_student_Comments); // Delete Comments by student.

router.get("/get/allassignmet", Controllers.Get_All_Assignments); // Get all assignments in student portal.
router.get("/get/allnotifications/uploadbyfaculty", Controllers.Get_All_Notifications); //Get all assignments Uplaod BY faculty.

router.post("/checkPlagiarism/:id", StudentAuthmiddleware, CommonuploadByfac.single('Assignment'), Controllers.CheckPlag);//Uplaod Assignment by student and check plagiarism.
router.get("/Getplag/report/:id", StudentAuthmiddleware, Controllers.GetPlagReport); // Get Plag REport.


router.get("/get/student/course-details", StudentAuthmiddleware, Controllers.Getsubjectdetails); // Get course details.
router.get("/get/content-notes/:id", StudentAuthmiddleware, Controllers.GetCourse_Notes);//Get Individual Course Notes.

router.get("/get/document-value/intext/:id", Controllers.Extract_Data); // Extract pdf data into string.
router.post("/add/student/completed/task-progress/:id", StudentAuthmiddleware, Controllers.Add_Student_Task_progress); // Add student task completed progress.
router.get("/get/student/task/progress", StudentAuthmiddleware, Controllers.Get_Progress); // Get task progress.

router.post("/post/feedback-complaint", StudentAuthmiddleware, FacultyProfileupload.single("problemimage"), Controllers.GenerateTicke)// Sent feedback/complaint form.
router.get("/get/individual-student-tickets-history", StudentAuthmiddleware, Controllers.Get_Resloved_Tickets); // Get Resolved tickets history.
router.post("/add/req/to-change-personal-details", StudentAuthmiddleware, Controllers.Add_Request_To_Change_details); // create a req to change personal details.








// -- Below code for Admin Routes -- 
router.post("/adminregistration", FacultyProfileupload.single("adminprofileimg"), Controllers.AdminSignupfunc); // Admin signup
router.post("/adminlogin", Controllers.AdminSignINfunc); // Admin Signin
router.get("/get/sucpicious/activity", Controllers.GetSucipicousactivity); // Get sucipious activity.
router.delete("/delete/sucipious/profile/:id", Controllers.Delete_Sucipicousactivity); // Delete Sucipious individual profile

router.post("/upload/notifications/byfaculty", AdminAuthmiddelware, CommonuploadByfac.single('notificationsbyfac'), Controllers.UplaodNotificationsbyFac);//Upload Notifications by Admin to student.
router.delete("/del/notification/:id", AdminAuthmiddelware, Controllers.Delete_Studentnotification); // delete uploaded notification which are uploded for student's

router.post("/upload/notifications/for-faculty/by/admin", AdminAuthmiddelware, CommonuploadByfac.single('notificationsforfaculty'), Controllers.UplaodNotificationsforFaculty);// Upload notification's for faculty.
router.get("/get/allnotifications/upload/by/Admin/for/faculty", Controllers.Get_All_Faculty_Notifications); // Get Faculty Notification's
router.delete("/del/Faculty/notification/:id", AdminAuthmiddelware, Controllers.Delete_Facultynotification); // delete uploaded notification which are uploded for Faculty's
router.get("/get/all-faculty", AdminAuthmiddelware, Controllers.Get_all_Faculty); // Get all faculty's
router.get("/get/all-faculty", AdminAuthmiddelware, Controllers.Get_all_Faculty); // Get all faculty's
router.post("/admin/add/individual/message/for-faculty/:id", AdminAuthmiddelware, CommonuploadByfac.single('attachment'), Controllers.Send_Individual_message); // Send individual message
router.get("/get/individual/faculty/progress/:id", AdminAuthmiddelware, Controllers.Get_individual_progress_faculty);//Get Individual Faculty progress.
router.get("/get/individual/message/by-faculty-id/and/reply/:id", AdminAuthmiddelware, Controllers.Get_Message_According_Faculty_ID); // Get message.
router.get("/get/all/message/which/are-created-by-admin/:id", AdminAuthmiddelware, Controllers.Get_All_Message_According_Faculty_ID); // Get All Admin Message which are sent to specific faculty by ID 
router.delete("/delete-faculty/:id", AdminAuthmiddelware, Controllers.Delete_Faculty); // Delete Faculty.
router.delete("/Delete/admin/message/:id", AdminAuthmiddelware, Controllers.Del_Message); // Delete Chat.
router.get("/get/support/problems", AdminAuthmiddelware, Controllers.Get_Support_Message); // Get all support query.
router.put("/add/query/message/:id", AdminAuthmiddelware, Controllers.Add_ticket_Reply_message); // Add ticket reply message.
router.delete("/close/ticket/:id", AdminAuthmiddelware, Controllers.Close_ticket); // close ticket
router.get("/get/incorrect-details", AdminAuthmiddelware, Controllers.Get_Incorrectdetails_Req); // Get all incorrect details 
router.put("/share/to/faculty/:id", AdminAuthmiddelware, Controllers.Share_Incorrect_details_with_fac); // share with fac 



// Below routes for chat-application
router.post("/create/new/user-account", FacultyProfileupload.single("profileImg"), Controllers.Create_user_acc); // create new user
router.post("/eagle/user/login/:id", Controllers.Login_eagle_user); // user login.
router.get("/get/all/eagler", Controllers.Get_All); // Get all eagler
router.get("/get/profile/:id", Controllers.Get_Individual_profile); // Get individual eagle profile.
router.put("/edit/personal/details/:id", FacultyProfileupload.single("profileImg"), Controllers.Edit_profile); // Edit profile
router.get("/get/firend/profile/byid/:id", Controllers.Get_Friend_data); // get friend profile..
router.post("/create/message/:id", Controllers.Chat_with_friends); // chat with friends -- :id means Reciver ID and senderID i sent in req.body.
router.get("/get/firend/chat-with-us/byid/:Rec_id/:Sender_id", Controllers.Get_Friend_with_chat); // Get message.
router.get("/get/all-firends/chat-with-us/:Sender_id", Controllers.Get_All_friend_chat); // get all user chat us.


module.exports = router;