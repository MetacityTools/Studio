FROM node:20

RUN apt update && apt install -y less man-db sudo

ARG USERNAME=node
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

ENV DEVCONTAINER=true

CMD /bin/sh -c "while sleep 1000; do :; done"

