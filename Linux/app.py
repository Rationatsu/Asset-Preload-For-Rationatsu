#!/usr/bin/env python3
import os, sys, subprocess, tkinter as tk
from tkinter import messagebox
from pathlib import Path
ROOT=Path(__file__).resolve().parent
APP_NAME='Designed By Rationatsu'
PAYPAL='https://www.paypal.com/paypalme/hikarurationatsu'
WEBSITE='https://rationatsu.base44.app'
AUTOSTART=Path.home()/'.config'/'autostart'/'designed-by-rationatsu.desktop'

def open_url(url):
    try: subprocess.Popen(['xdg-open',url], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception as e: messagebox.showerror('Could not open link',str(e))

def install_cursor():
    try:
        result=subprocess.run(['bash',str(ROOT/'install-cursor.sh')],capture_output=True,text=True)
        if result.returncode==0: messagebox.showinfo('Cursor theme installed',result.stdout.strip() or 'Installed successfully.')
        else: messagebox.showerror('Install failed',(result.stdout+'\n'+result.stderr).strip() or 'Install failed.')
    except Exception as e: messagebox.showerror('Install failed',str(e))

def set_autostart():
    if auto_var.get():
        AUTOSTART.parent.mkdir(parents=True,exist_ok=True)
        exe=sys.executable
        AUTOSTART.write_text('[Desktop Entry]\nType=Application\nName=Designed By Rationatsu\nComment=Hikaru cursor installer\nExec="%s" "%s"\nX-GNOME-Autostart-enabled=true\nTerminal=false\n' % (exe,str(ROOT/'app.py')))
        messagebox.showinfo('Auto-start enabled','The app will open automatically when your Linux desktop session starts (if your desktop supports autostart).')
    else:
        try: AUTOSTART.unlink()
        except FileNotFoundError: pass
        messagebox.showinfo('Auto-start disabled','The automatic startup entry has been removed.')

def main():
    global auto_var
    root=tk.Tk(); root.title(APP_NAME); root.geometry('520x560'); root.resizable(False,False)
    try:
        icon=tk.PhotoImage(file=str(ROOT/'assets/app-icon.png')); root.iconphoto(True,icon)
    except Exception: pass
    root.configure(bg='#171923')
    tk.Label(root,text='Designed By Rationatsu',font=('Sans',20,'bold'),fg='#f6f7fb',bg='#171923').pack(pady=(18,4))
    tk.Label(root,text='animation and design by Apron - oc by Rationatsu',font=('Sans',9),fg='#c7c9d3',bg='#171923').pack(pady=(0,10))
    try:
        img=tk.PhotoImage(file=str(ROOT/'assets/app-icon.png'))
        tk.Label(root,image=img,bg='#171923').pack(pady=4); root._appimg=img
    except Exception: pass
    tk.Label(root,text='Hikaru Animated Cursor Theme for Linux',font=('Sans',12,'bold'),fg='#a8d8ff',bg='#171923').pack(pady=(8,4))
    tk.Label(root,text='Install your cursor theme from the GIF animations you provided.\nNote: this changes the Linux desktop cursor theme, not the\nChromeOS system cursor outside the Linux environment.',justify='center',fg='#e0e2ea',bg='#171923',font=('Sans',10)).pack(pady=8)
    tk.Button(root,text='Install / Apply Cursor Theme',command=install_cursor,font=('Sans',11,'bold'),bg='#a8d8ff',fg='#171923',activebackground='#d3ecff',relief='flat',padx=16,pady=9).pack(pady=10)
    auto_var=tk.BooleanVar(value=AUTOSTART.exists())
    tk.Checkbutton(root,text='Open this app automatically when Linux starts',variable=auto_var,command=set_autostart,bg='#171923',fg='#f6f7fb',selectcolor='#303443',activebackground='#171923',activeforeground='#fff',font=('Sans',10)).pack(pady=8)
    tk.Label(root,text='Copyright © Rationatsu',font=('Sans',10,'bold'),fg='#f6f7fb',bg='#171923').pack(pady=(12,5))
    row=tk.Frame(root,bg='#171923'); row.pack(pady=3)
    tk.Button(row,text='PayPal',command=lambda:open_url(PAYPAL),bg='#303443',fg='white',relief='flat',padx=18,pady=6).pack(side='left',padx=6)
    tk.Button(row,text='Rationatsu Website',command=lambda:open_url(WEBSITE),bg='#303443',fg='white',relief='flat',padx=18,pady=6).pack(side='left',padx=6)
    tk.Label(root,text='Made with the supplied Hikaru GIF cursor animations.',font=('Sans',8),fg='#969aaa',bg='#171923').pack(side='bottom',pady=12)
    root.mainloop()
if __name__=='__main__': main()
