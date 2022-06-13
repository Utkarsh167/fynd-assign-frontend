//export const serverUrl = "http://localhost:8080/" 
//export const serverUrl = "ec2-3-129-106-19.us-east-2.compute.amazonaws.com/"

let serverUrlEnv= ""
if(window.location.hostname.indexOf("localhost") > -1){
    serverUrlEnv= "http://localhost:3000/" 
}
else{
    serverUrlEnv="https://fynd-assign.herokuapp.com/"
}


export const serverUrl = serverUrlEnv

// export const googleSocialLogin = '419339209277-icvnmqnvpsca0gvfc7sd7lnv144hrvet.apps.googleusercontent.com'