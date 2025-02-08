**Senior Citizen Activity Tracking and Monitoring System**  

**Overview**  
The Senior Citizen Activity Tracking and Monitoring System is a web-based application designed to assist caregivers and administrators in tracking the well-being, activities, and progress of senior citizens. The system facilitates monitoring physical activities, cognitive tasks, social interactions, and progress tracking while allowing secure logins for seniors, caregivers, and administrators.  

**Features**  
1. **User Authentication & Role-Based Access**  
   - **Admin Login**: Allows administrators to manage users and system settings.  
   - **Caregiver Login**: Enables caregivers to monitor and manage their assigned seniors.  
   - **Senior Login**: Provides seniors with access to their own activity records and progress tracking.  

2. **Senior Management**  
   - Fetch all seniors from the database.  
   - Retrieve detailed profiles of individual seniors.  
   - Add new seniors with personal and medical information.  
   - Assign seniors to caregivers.  

3. **Caregiver Management**  
   - Fetch all caregivers.  
   - Retrieve individual caregiver profiles.  
   - Add new caregivers to the system.  
   - Assign caregivers to seniors.  

4. **Activity Monitoring**  
   - Track and log physical activities (e.g., exercise routines, duration, intensity, completion status).  
   - Monitor cognitive tasks (e.g., puzzles, memory exercises) with assigned difficulty levels and completion tracking.  
   - Log social interactions to encourage engagement and mental well-being.  

5. **Progress Tracking & Reports**  
   - Fetch progress tracking reports for seniors.  
   - Record progress updates, including performance scores and improvement notes.  
   - Fetch detailed reports for administrators to analyze senior well-being trends.  

6. **Database Cleanup & Maintenance**  
   - Automated cleanup of redundant activity participation data using stored procedures.  

**Installation & Setup**  

**Prerequisites**  
- Node.js (v14+)  
- MySQL (v8+)  
- Postman (for API testing, optional)  


**API Endpoints**  

**Authentication**  
- `POST /api/admin/login` - Admin login.  
- `POST /api/caregiver/login` - Caregiver login.  
- `POST /api/senior/login` - Senior login.  

**Seniors**  
- `GET /api/seniors` - Fetch all seniors.  
- `GET /api/senior/profile?seniorID=1` - Fetch senior profile by ID.  
- `POST /api/admin/senior` - Add a new senior.  

**Caregivers**  
- `GET /api/caregivers` - Fetch all caregivers.  
- `GET /api/caregiver/profile?caregiverID=1` - Fetch caregiver profile by ID.  
- `POST /api/admin/caregiver` - Add a new caregiver.  

**Activity Tracking**  
- `POST /api/caregiver/physical-activity` - Add a physical activity.  
- `POST /api/caregiver/cognitive-task` - Add a cognitive task.  
- `POST /api/caregiver/social-interaction` - Add a social interaction.  
- `GET /api/senior/:seniorID/physical-activities` - Get physical activities for a senior.  
- `GET /api/senior/:seniorID/cognitive-tasks` - Get cognitive tasks for a senior.  
- `GET /api/senior/:seniorID/social-interactions` - Get social interactions for a senior.  

**Progress Tracking**  
- `POST /api/progress` - Save progress tracking data.  
- `GET /api/senior/:seniorID/progress-tracking` - Fetch progress tracking data for a senior.  

**Cleanup Procedure**  
- `POST /api/clean-activity-participation` - Remove redundant activity participation records.  

**E-R Diagram**  
![image](https://github.com/user-attachments/assets/044684eb-cc56-4d73-accc-9f09de4abc72)


**Database Schema**  
- **Seniors**: Stores senior citizens' personal and medical details.  
- **Caregivers**: Maintains caregiver information and assigned seniors.  
- **PhysicalActivities**: Logs physical activities with intensity and completion status.  
- **CognitiveTasks**: Tracks cognitive exercises and completion.  
- **SocialInteractions**: Stores logged interactions to monitor social engagement.  
- **ProgressTracking**: Records progress reports and evaluations.  
- **Admins**: Stores admin credentials for secure access.  

**Screenshots**  
![image](https://github.com/user-attachments/assets/960498cf-7fb7-4e95-bf8e-1a37d239c130)
![image](https://github.com/user-attachments/assets/082947ee-4336-464b-9324-2efc1232c9f6)
![image](https://github.com/user-attachments/assets/0ffea0fa-fe28-4931-b5d2-48cd52f313f9)
![image](https://github.com/user-attachments/assets/1195cfe2-42da-4764-8927-553c93df64b6)
![image](https://github.com/user-attachments/assets/c8310d8d-6192-4bd0-9ffe-e4df8b1435d9)




  

**Future Enhancements**  
- **Mobile App Support** for easier caregiver updates.  
- **Real-time Alerts** for missed activities or urgent updates.  
- **Health Data Integration** with wearable devices.  

**Contributors**  
Harshith Kumar -[mrproducer69]
S Pranava - [unfunnypsh]  

**License**  
This project is licensed under the MIT License - see the LICENSE file for details.  
