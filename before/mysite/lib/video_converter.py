import subprocess

def check_codec(filepath, filename, filetype):
    codec_args = ['C:\\ffmpeg\\bin\\ffprobe.exe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                  'stream=codec_name', '-of', 'default=noprint_wrappers=1:nokey=1', filepath + filename]
    try:
        codec = subprocess.check_output(codec_args)
    except:
        return 2

    if codec[:-2].decode('utf8') != 'h264' or filetype in ['avi', 'vga', 'mpeg']:
        return convert_codec(filepath, filename)
    else:
        return 0

def convert_codec(filepath, filename):
    convert_args = ['C:\\ffmpeg\\bin\\ffmpeg.exe', '-y', '-i', filepath + filename,
                    '-f', 'mp4', '-vcodec', 'h264', '%s%s(1).mp4' % (filepath, filename.split('.')[0])]
    try:
        subprocess.check_output(convert_args)
    except:
        return 2
    return 1
