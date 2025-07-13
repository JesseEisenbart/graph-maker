import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setConcurrency(1);
Config.setDelayRenderTimeoutInMilliseconds(30000);
Config.setTimeoutInMilliseconds(30000);
Config.setChromiumOpenGlRenderer('egl');
