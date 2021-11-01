WScript.Echo("Auto Start Game ...")
Do While 1 = 1
    CreateObject("WScript.Shell").run "sqlcmd -d moe3 -Q ""execute StartGame""",0 
    WScript.Sleep(1000)
Loop