const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')

module.exports = {
    async index(req, res) {
        const jobs = await Job.get()
        const profile = await Profile.get()

        let statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length
            
        }
        let jobTotalHours = 0

        const updatedJobs = jobs.map((job) => {
        const remaining = JobUtils.remainingDays(job)
        const status = remaining <= 0 ? 'done' : 'progress';

        statusCount[status] += 1;

        jobTotalHours = status == 'progress' ? jobTotalHours + Number(job['daily-hours']) : jobTotalHours
            // ajustes 
            //calculo de tempo restant
            return {
                ...job,
                remaining,
                status,
                budget: JobUtils.calculateBudget(job, profile["value-hour"])
            };
        });
        // qtd de horas que quero trabalhar menos  a qtd de horas dia em progress
        const freeHours = profile["hours-per-day"] - jobTotalHours;

        return res.render("index", { jobs: updatedJobs, profile: profile, statusCount: statusCount, freeHours: freeHours });
    },
}
//JORGEMORAIS funcao para tabs

// function openTab(evt, tabName) {
//     var i, tabcontent, tablinks;

//     tabcontent = document.getElementsByClassName("tabcontent");
//         for (i = 0; i < tabcontent.length; i++) {
//             tabcontent[i].style.display = "none";
//         }

//     tablinks = document.getElementsByClassName("tablinks");
//         for (i = 0; i < tablinks.length; i++) {
//             tablinks[i].className = tablinks[i].className.replace(" active", "");
//         }

//     document.getElementById(tabName).style.display = "block";
//     evt.currentTarget.className += " active";
    
// }
// document.getElementById("defaultOpen").click();

// // login popup
// function loginpopup() {
// 	varWindow = window.open ('login.php', 'popup')
// }